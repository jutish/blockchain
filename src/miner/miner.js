import { Transaction, blockchainWallet }  from '../wallet'

class Miner{

	constructor(blockchain, p2pService, wallet){
		this.blockchain = blockchain;
		this.p2pService = p2pService;
		this.wallet = wallet;
	};

	mine() {
		const { 
			blockchain: { memoryPool },
			p2pService, 
			wallet } = this;
		if(memoryPool.transactions.length === 0) throw Error('There are no unconfirmed transactions.');

		/*
		4. Wipe transactions from memory pool.
		5. Broadcasting wipe message to every node.
		*/
		
		// 1. Include reward to miner in transaction.
		memoryPool.transactions.push(Transaction.reward(wallet, blockchainWallet));
		
		// 2. Create a block consisting on valid transactions.
		const block = this.blockchain.addBlock(memoryPool.transactions);
		
		// 3. Sync new blockchain with the network.
		p2pService.syn();

		return block;
	}

}

export default Miner; 