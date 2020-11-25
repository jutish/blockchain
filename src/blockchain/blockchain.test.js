import Blockchain from './blockchain';
import Block from './block';

describe('Blockchain',()=>{
	let blockchain;
	let blockchainB; /*Segunda blockchain para probar el metodo replace()*/

	beforeEach(()=>{
		blockchain = new Blockchain();
		blockchainB = new Blockchain();
	});
		
	it('Every blockchain has a Genesis Block',()=>{
		const [genesisBlock] = blockchain.blocks;

		expect(genesisBlock).toEqual(Block.genesis);
		expect(blockchain.blocks.length).toEqual(1);
	});

	it('use addBlock',()=>{
		const data = 'd4t4';
		blockchain.addBlock(data);

		const [,lastBlock] = blockchain.blocks;
		expect(lastBlock.data).toEqual(data);
		expect(blockchain.blocks.length).toEqual(2);
	});

	it('replaces the chain with a valid chain',()=>{
		blockchainB.addBlock('bl4ck-1');
		blockchain.replace(blockchainB.blocks);
		expect(blockchain.blocks).toEqual(blockchainB.blocks);
	});

	it('does not replace with one with less blocks',()=>{
		blockchain.addBlock('block-1');
		expect(()=>{
			blockchain.replace(blockchainB.blocks)
		}).toThrowError('Received chain is not longer than current chain.')
	});

	it('does not replace the chain with one is not valid',()=>{
		blockchainB.addBlock('block-1');
		blockchainB.blocks[1].data = 'block-h4ck';
		expect(()=>{
			blockchain.replace(blockchainB.blocks)
		}).toThrowError('Received chain is invalid') ;
	});


});

