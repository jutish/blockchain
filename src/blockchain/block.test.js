import Block, {DIFFICULTY} from './block';

describe('Block',() => {
	let timestamp;
	let previousBlock;
	let data;
	let hash;
	let nonce;

	beforeEach(()=>{
		timestamp = new Date(2010,0,1); //1ro de enero 2010
		previousBlock = Block.genesis;
		data = 't3St-d4t4';
		hash = 't3St-h4a5h';
		nonce = 128;
	});

	it('create an instance with parameters',()=>{
		const block = new Block(timestamp, previousBlock.hash, hash, data,nonce);

		expect(block.timestamp).toEqual(timestamp);
		expect(block.previousHash).toEqual(previousBlock.hash);
		expect(block.data).toEqual(data);
		expect(block.hash).toEqual(hash);
		expect(block.nonce).toEqual(nonce);
	});

	it('use static mine()',()=>{
		const block = Block.mine(previousBlock,data);
		let { difficulty } = block;
		expect(block.hash.length).toEqual(64); //Un hash correcto tiene 64 caracteres.
		expect(block.hash.substring(0,difficulty)).toEqual('0'.repeat(difficulty)); //Espero que el hash comience con los ceros determinados por la dificultad
		expect(block.previousHash).toEqual(previousBlock.hash);
		expect(block.data).toEqual(data);
		expect(block.nonce).not.toEqual(0);	
	});

	it('use static hash()',()=>{
		const hash = Block.hash(timestamp,previousBlock.hash,data,nonce);
		const expect_hash = "1e689a29a8b81b45ed77275abccb5dca29761f268acd855c839ec38036dc45dc";

		expect(hash).toEqual(expect_hash);
	});

	it('use toString()',()=>{
		const block = Block.mine(previousBlock,data);
		console.log(block.toString());

		expect(typeof(block.toString())).toEqual('string');
	});
})