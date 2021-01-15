import uuidV1 from 'uuid/v1'; //universal unic id, instancio el metodo uuidV1	

class Transaction{

	constructor(){
		this.id = uuidV1();
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


	}

}

export default Transaction;