class Miner{

	constructor(blockchain, p2pService, wallet){
		this.blockchain = blockchain;
		this.p2pService = p2pService;
		this.wallet = wallet;
	};

	mine() {
		const { blockchain: { memoryPool } } = this;
		/*
		1. Include reward to miner in transaction.
		2. Create a block consisting on valid transactions.
		3. Sync new blockchain with the network.
		4. Wipe transactions from memory pool.
		5. Broadcasting wipe message to every node.
		6. 
		*/
	};

}

export default Miner; 