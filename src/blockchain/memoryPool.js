import { Transaction }  from '../wallet';
class MemoryPool{

	constructor(){
		this.transactions = [];
	}

	addOrUpdate(transaction){
		const { input, outputs = [] } = transaction;

		const outputTotal = outputs.reduce((total, output) => total + output.amount, 0); //Suma todo el array Outputs

		if(input.amount !== outputTotal) throw Error(`Invalid transaction from ${input.address}`);  //El total del input debe ser igual al total de output
		if(!Transaction.verify(transaction)) throw Error(`Invalid signature from ${input.address}`) 	
		
		const txIndex = this.transactions.findIndex(({ id }) => id === transaction.id);
		if (txIndex >= 0) this.transactions[txIndex] = transaction;
		else this.transactions.push(transaction);
	}

	find(address){
		return this.transactions.find(({ input }) => input.address === address);
	}

}

export default MemoryPool; 

