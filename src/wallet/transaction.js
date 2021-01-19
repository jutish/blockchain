//import uuidV1 from 'uuid/v1'; //universal unic id, instancio el metodo uuidV1	
import { v1 as uuidv1 } from 'uuid';
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

		transaction.input = {
			timestamp: Date.now(),
			amount: senderWallet.balance,
			address: senderWallet.publicKey,
			signature: senderWallet.sign(transaction.outputs),
		}

		return transaction;
	}

	static verify(transaction){
		const { input: { address, signature }, outputs } = transaction;
	}

	

}

export default Transaction;