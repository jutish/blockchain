class MemoryPool{

	constructor(){
		this.transactions = [];
	}

	addOrUpdate(transaction){
		const txIndex = this.transaction.findIndex(({ id }) => id === transaction.id);
		if (txIndex >= 0) this.transactions[txIndex] = transaction;
		else this.transactions.push(transaction);
	}

}

export default MemoryPool; 

