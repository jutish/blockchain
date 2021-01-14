import Blockchain from './src/blockchain';

const blockchain = new Blockchain();

for(let i = 0; i < 10; i += 1){
	const block = blockchain.addBlock(`Block-${i + 1}`); 
	console.log(block.toString());
}