import Wallet, { INITIAL_BALANCE } from './wallet';

describe('wallet',() => {

	let wallet;

	beforeEach(() => {
		wallet = new Wallet();
	});

	it('is a healthy wallet',() => {
		expect(wallet.balance).toEqual(INITIAL_BALANCE);
		expect(typeof wallet.keyPair).toEqual('object');
		expect(typeof wallet.publicKey).toEqual('string');
		expect(wallet.publicKey.length).toEqual(130);
	});

	it('use sign()',() => {
		const signature = wallet.sign('cualquier_dato');
		expect(typeof signature).toEqual('object');
		expect(signature).toEqual(wallet.sign('cualquier_dato'));
	});

});