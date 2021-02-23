import { Transaction, blockchainWallet }  from '../wallet'
import { MESSAGE } from '../service/p2p';

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

		// 1. Include reward to miner in transaction.
		memoryPool.transactions.push(Transaction.reward(wallet, blockchainWallet));
		
		// 2. Create a block consisting on valid transactions.
		const block = this.blockchain.addBlock(memoryPool.transactions);
		
		// 3. Sync new blockchain with the network.
		p2pService.sync();

		//4. Wipe transactions from memory pool.
		memoryPool.wipe();

		//5. Broadcasting wipe message to every node.
		p2pService.broadcast(MESSAGE.WIPE)

		return block;
	}

}

export default Miner; 