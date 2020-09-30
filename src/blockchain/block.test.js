import Block from './block';

describe('Block',() => {
	let timestamp;
	let previousBlock;
	let data;
	let hash;

	beforeEach(()=>{
		timestamp = new Date(2010,0,1); //1ro de enero 2010
		previousBlock = Block.genesis;
		data = 't3St-d4t4';
		hash = 't3St-h4a5h';
	});

	it('create an instance with parameters',()=>{
		const block = new Block(timestamp, previousBlock.hash, hash, data);

		expect(block.timestamp).toEqual(timestamp);
		expect(block.previousHash).toEqual(previousBlock.hash);
		expect(block.data).toEqual(data);
		expect(block.hash).toEqual(hash);
	});

	it('use static mine()',()=>{
		const block = Block.mine(previousBlock,data);

		expect(block.hash.length).toEqual(64) //Un hash correcto tiene 64 caracteres.
		expect(block.previousHash).toEqual(previousBlock.hash);
		expect(block.data).toEqual(data);
	});

	it('use static hash()',()=>{
		const hash = Block.hash(timestamp,previousBlock.hash,data);
		const expect_hash = '9e7ba383935c55c73df91a2b69102dcd7a3fa97c4c5b1c5a9b0a7963c69a2ae0';

		expect(hash).toEqual(expect_hash);
	});

	it('use toString()',()=>{
		const block = Block.mine(previousBlock,data);

		expect(typeof(block.toString())).toEqual('string');
	});
})