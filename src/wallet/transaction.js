import { v1 as uuidv1 } from 'uuid';
import { elliptic } from '../modules';

const REWARD = 1;

class Transaction{

	constructor(){
		this.id = uuidv1();
		this.input = null;
		this.outputs =[];
	}

	//Este metodo crea una nueva instancia de Transaction
	static create(senderWallet, recipientAdress, amount){
		const { balance, publicKey } = senderWallet;

		if(amount > balance) throw Error(`Amount: ${amount} exceeds balance.`);

		const transaction = new Transaction();
		transaction.outputs.push(...[
			{ amount: balance - amount, address: publicKey }, //El primer valor siempre es mi estado.
			{ amount: amount, address: recipientAdress} //Luego el monto transferido y la PublicKey de su direccion.
		]);

		transaction.input = Transaction.sign(transaction, senderWallet);

		return transaction;
	}

	//Crea una transaction para recompensar al Miner. Toma monedas de blockchainWallet y las envia a MinerWallet
	static reward(minerWallet, blockchainWallet){
		return this.create(blockchainWallet, minerWallet.publicKey, REWARD);
	}

	static verify(transaction){
		const { input: { address, signature }, outputs } = transaction;

		return elliptic.verifySignature(address, signature, outputs);
	}

	static sign(transaction, senderWallet){
		return {
			timestamp: Date.now(),
			amount: senderWallet.balance,
			address: senderWallet.publicKey,
			signature: senderWallet.sign(transaction.outputs),
		};
	}

	update(senderWallet, recipientAdress, amount){
		const senderOutput = this.outputs.find((output) => output.address === senderWallet.publicKey);
		
		if(amount > senderOutput.amount) throw Error(`Amount: ${amount} exceeds balance`);

		senderOutput.amount -= amount;
		this.outputs.push({ amount, address:recipientAdress }); 
		this.input = Transaction.sign(this,senderWallet)

		return this;
	}

	

}

export { REWARD }; 
export default Transaction;