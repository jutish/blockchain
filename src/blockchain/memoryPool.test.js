import MemoryPool from './memoryPool';
import Wallet, { Transaction } from '../wallet'; // Esto lo puedo hacer gracias al index.js creado en la carpeta wallet

describe('MemoryPool', () => {
  let memoryPool;
  let wallet;
  let transaction;

  beforeEach(() => {
    memoryPool = new MemoryPool();
    wallet = new Wallet();
    transaction = Transaction.create(wallet, 'dest_address', 5);
    memoryPool.addOrUpdate(transaction);
  });

  it('has one transaction', () => {
    expect(memoryPool.transactions.length).toEqual(1);
  });

  it('adds a transaction to the memoryPool', () => {
    const found = memoryPool.transactions.find(({ id }) => id === transaction.id);
    expect(found).toEqual(transaction);
  });

  it('updates a transaction in the memoryPool', () => {
    const txOld = JSON.stringify(transaction);
    const txNew = transaction.update(wallet, 'other_address', 10);

    memoryPool.addOrUpdate(txNew);

    expect(memoryPool.transactions.length).toEqual(1);

    const found = memoryPool.transactions.find(({ id }) => id === transaction.id);
    expect(JSON.stringify(txNew)).not.toEqual(txOld);
    expect(txNew).toEqual(found);
  });

  it('wipes transactions', () => {
    memoryPool.wipe();
    expect(memoryPool.transactions.length).toEqual(0);
  });
});
