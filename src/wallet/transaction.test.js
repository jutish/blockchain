import Transaction, { REWARD } from './transaction';
import Wallet from './wallet';
import { blockchainWallet } from './index';

describe('transaction', () => {
  let wallet;
  let transaction;
  let amount;
  let recipientAdress;

  beforeEach(() => {
    wallet = new Wallet();
    recipientAdress = 'cualquier_valor';
    amount = 5;
    transaction = Transaction.create(wallet, recipientAdress, amount);
  });

  // Chequeamos que nuestro balance al final sea 95
  it('outputs the `amount` subtracted from the wallet balance', () => {
    const output = transaction.outputs.find(({ address }) => address === wallet.publicKey);
    expect(output.amount).toEqual(wallet.balance - amount);
  });

  it('outputs the `amount` added to the recipient', () => {
    const output = transaction.outputs.find(({ address }) => address === recipientAdress);
    expect(output.amount).toEqual(amount);
  });

  describe('transacting with an amount that exceeds the balance', () => {
    beforeEach(() => {
      amount = 500;
      transaction = null;
    });

    it('does not create the transaction', () => {
      expect(() => {
        transaction = Transaction.create(wallet, recipientAdress, amount);
      }).toThrowError(`Amount: ${amount} exceeds balance.`);
    });
  });

  it('inputs the balance of the wallet', () => {
    expect(transaction.input.balance).toEqual(wallet.amount);
  });

  it('inputs the sender address of the wallet', () => {
    expect(transaction.input.address).toEqual(wallet.publicKey);
  });

  it('inputs has a signature using the wallet', () => {
    expect(typeof transaction.input.signature).toEqual('object');
    expect(transaction.input.signature).toEqual(wallet.sign(transaction.outputs));
  });

  it('validates a valid transaction', () => {
    expect(Transaction.verify(transaction)).toBe(true);
  });

  it('invalidates a corrupt transaction', () => {
    transaction.outputs[1].amount = 10;
    expect(Transaction.verify(transaction)).toBe(false);
  });

  describe('and updating a transaction', () => {
    let nextAmount;
    let nextRecipient;

    beforeEach(() => {
      nextAmount = 3;
      nextRecipient = 'Otra_addres';
      transaction = transaction.update(wallet, nextRecipient, nextAmount);
    });

    it('substracts the next amount from the sender wallet', () => {
      const senderOutput = transaction.outputs.find((output) => output.address === wallet.publicKey);
      expect(senderOutput.amount).toEqual(wallet.balance - amount - nextAmount);
    });

    it('outputs an amount for the next recipient', () => {
      const output = transaction.outputs.find(({ address }) => address === nextRecipient);
      expect(output.amount).toEqual(nextAmount);
    });
  });

  describe('creating a reward transaction', () => {
    beforeEach(() => {
      transaction = Transaction.reward(wallet, blockchainWallet);
    });

    it('reward the miner wallet', () => {
      expect(transaction.outputs.length).toEqual(2);

      let output = transaction.outputs.find(({ address }) => address === wallet.publicKey);
      expect(output.amount).toEqual(REWARD);

      output = transaction.outputs.find(({ address }) => address === blockchainWallet.publicKey);
      expect(output.amount).toEqual(blockchainWallet.balance - REWARD);
    });
  });
});
