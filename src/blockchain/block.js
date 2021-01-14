import { SHA256 } from 'crypto-js'; 
import  adjustDifficulty  from './modules/adjustDifficulty';
const DIFFICULTY = 3;	//Dificultad del ProofOfWork

class Block{

	constructor(timestamp,previousHash,hash,data,nonce,difficulty){
		this.timestamp = timestamp;
		this.previousHash = previousHash;
		this.hash = hash;
		this.data = data;
		this.nonce = nonce;
		this.difficulty = difficulty;
	}

	static get genesis(){
		const timestamp = (new Date(200,0,1)).getTime();
		return new this(timestamp,undefined,'_g3n3s1s-h4sh','Aguante la pizza a la parrilla',0,DIFFICULTY)
	}

	static mine(previousBlock, data){
		
		const { hash: previousHash } = previousBlock;
		let timestamp;
		let hash;
		let nonce = 0;
		let { difficulty } = previousBlock;

		do{
			timestamp = Date.now();
			nonce +=1; //Es un numero pseudoaleatorio que agrego al calculo del Hash para que este en algun punto pase el ProofOfWork. Junto con el timestamp le dan esa variacion. Sino siempre devolveria el mismo HASH
			difficulty = adjustDifficulty(previousBlock,timestamp);
			hash = Block.hash(timestamp,previousHash,data,nonce,difficulty);
		}while(hash.substring(0,difficulty)!=='0'.repeat(difficulty)) //Mientras que el Hash no comience con tantos Zeros como esta definido la DIFFICULTY entonces itero.

		return new this(timestamp,previousHash,hash,data,nonce,difficulty);
	}

	static hash(timestamp,previousHash,data,nonce,difficulty){ 
		return SHA256(`${timestamp}${previousHash}${data}${nonce}${difficulty}`).toString();
	}

	toString(){
		const{
			timestamp,previousHash,hash,data,nonce,difficulty
		} = this;
	
	return `Block -
			timestamp		: ${timestamp}
			previousHash	: ${previousHash}
			hash			: ${hash}
			data			: ${data}
			nonce 			: ${nonce}
			difficulty      : ${difficulty}

		`;
	}
}

export {DIFFICULTY};
export default Block;