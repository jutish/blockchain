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

		expect(block.hash.length).toEqual(64); //Un hash correcto tiene 64 caracteres.
		expect(block.hash.substring(0,DIFFICULTY)).toEqual('0'.repeat(DIFFICULTY)); //Espero que el hash comience con los ceros determinados por la dificultad
		expect(block.previousHash).toEqual(previousBlock.hash);
		expect(block.data).toEqual(data);
		expect(block.nonce).not.toEqual(0);	
	});

	it('use static hash()',()=>{
		const hash = Block.hash(timestamp,previousBlock.hash,data,nonce);
		const expect_hash = 'eac704a381f6d805847b01cb7086b5d74bdd7a39a5c589f88474c4aa42bcccbe';

		expect(hash).toEqual(expect_hash);
	});

	it('use toString()',()=>{
		const block = Block.mine(previousBlock,data);
		console.log(block.toString());

		expect(typeof(block.toString())).toEqual('string');
	});
})