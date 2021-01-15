const INITIAL_BALANCE = 100;

class Wallet {
	constructor(){
		this.balance = INITIAL_BALANCE;
		this.keyPair = null;
		this.publicKey = null;
	};

	toString(){
		const { balance, publicKey } = this;

		return `Wallet - 
			publicKey : ${publicKey}
			balance   : ${balance} 
		`;
	}
}

export default Wallet;