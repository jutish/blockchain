import Elliptic from 'elliptic';
import hashSign from '../modules/hash';

const ec = new Elliptic.ec('secp256k1'); //Creo una nueva curva eliptica
const INITIAL_BALANCE = 100;

class Wallet {
	constructor(){
		this.balance = INITIAL_BALANCE;
		this.keyPair = ec.genKeyPair();
		this.publicKey = this.keyPair.getPublic().encode('hex');
	};

	toString(){
		const { balance, publicKey } = this;

		return `Wallet - 
			publicKey : ${publicKey}
			balance   : ${balance} 
		`;
	}

	sign(data){
		return this.keyPair.sign(hashSign(data));
	}
}

export { INITIAL_BALANCE };
export default Wallet;