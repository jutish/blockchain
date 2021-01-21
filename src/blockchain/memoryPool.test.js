import MemoryPool from './memoryPool';
import Wallet, { Transaction } from '../wallet'; //Esto lo puedo hacer gracias al index.js creado en la carpeta wallet

describe('MemoryPool', () => {
	let memoryPool;
	let wallet;
	let transaction

	beforeEach(() => {
		memoryPool = new MemoryPool();
		wallet = new Wallet();
		transaction = Transaction.create(wallet,'dest_address',5);
		memoryPool.addOrUpdate(transaction);
	});

	it('has one transaction', () => {
		expect(memoryPool.transactions.length).toEqual(1);
	});
});
