import { SHA256 } from 'crypto-js'; 
const DIFFICULTY = 3; //Dificultad del ProofOfWork

class Block{

	constructor(timestamp,previousHash,hash,data,nonce){
		this.timestamp = timestamp;
		this.previousHash = previousHash;
		this.hash = hash;
		this.data = data;
		this.nonce = nonce;
	}

	static get genesis(){
		const timestamp = (new Date(200,0,1)).getTime();
		return new this(timestamp,undefined,'_g3n3s1s-h4sh','Aguante la pizza a la parrilla')
	}

	static mine(previousBlock, data){
		
		const {hash: previousHash} = previousBlock;
		let timestamp;
		let hash;
		let nonce = 0;

		do{
			timestamp = Date.now();
			nonce +=1; //Es un numero pseudoaleatorio que agrego al calculo del Hash para que este en algun punto pase el ProofOfWork. Junto con el timestamp le dan esa variacion. Sino siempre devolveria el mismo HASH
			hash = Block.hash(timestamp,previousHash,data,nonce);
		}while(hash.substring(0,DIFFICULTY)!=='0'.repeat(DIFFICULTY)) //Mientras que el Hash no comience con tantos Zeros como esta definido la DIFFICULTY entonces itero.

		return new this(timestamp,previousHash,hash,data,nonce);
	}

	static hash(timestamp,previousHash,data,nonce){ 
		return SHA256(`${timestamp}${previousHash}${data}${nonce}`).toString();
	}

	toString(){
		const{
			timestamp,previousHash,hash,data
		} = this;
	
	return `Block -
			timestamp		: ${timestamp}
			previousHash	: ${previousHash}
			hash			: ${hash}
			data			: ${data}
			nonce 			: ${nonce}

		`;
	}
}

export default Block;