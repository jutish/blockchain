import Blockchain from '../blockchain';
import validate from './validate';

describe('validate', () => {
  let blockchain;
  beforeEach(() => {
    blockchain = new Blockchain();
  });

  it('validates a valid chain', () => {
    blockchain.addBlock('b10ck-1');
    blockchain.addBlock('b10ck-2');

    expect(validate(blockchain.blocks)).toBe(true);
  });

  it('invalidates a chain with a corrupt genesis block', () => {
    blockchain.blocks[0].data = 'corrupt-d4t4'; // Cambio el data al bloque genesis de la cadena.
    expect(() => {
      validate(blockchain.blocks);
    }).toThrowError('Invalid Genesis Block');
  });

  it('invalidates a chain with a corrupt previous hash', () => {
    blockchain.addBlock('b10ck-1');
    blockchain.addBlock('b10ck-2');
    blockchain.blocks[2].previousHash = 'corrupt-h4sh';
    expect(() => {
      validate(blockchain.blocks);
    }).toThrowError('Invalid previous Hash');
  });

  it('invalidates a chain with a corrupt hash', () => {
    blockchain.addBlock('b10ck-1');
    blockchain.blocks[1].hash = 'corrupt-h4sh';
    expect(() => {
      validate(blockchain.blocks);
    }).toThrowError('Invalid Hash');
  });
});
