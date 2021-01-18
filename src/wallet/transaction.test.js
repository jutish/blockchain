import Transaction from './transaction';
import Wallet from './wallet';

describe('transaction',() => {

	let wallet;
	let transaction;
	let amount;
	let recipientAdress;

	beforeEach(() => {
		wallet = new Wallet();
		recipientAdress = 'cualquier_valor';
		amount = 5;
		transaction = Transaction.create(wallet,recipientAdress,amount);
	});

	//Chequeamos que nuestro balance al final sea 95
	it('outputs the `amount` subtracted from the wallet balance', () => {
		const output = transaction.outputs.find(({ address }) => address === wallet.publicKey);
		expect(output.amount).toEqual(wallet.balance - amount);
	});

	it('outputs the `amount` added to the recipient',() => {
		const output = transaction.outputs.find(({ address }) => address === recipientAdress);
		expect(output.amount).toEqual(amount);
	});	

	describe('transacting with an amount that exceeds the balance',() => {
		beforeEach(() => {
			amount = 500;
			transaction = null;
		});

		it('does not create the transaction',() => {
			expect(() => {
				transaction = Transaction.create(wallet,recipientAdress,amount);
			}).toThrowError(`Amount: ${amount} exceeds balance.`);
		});
	});


});