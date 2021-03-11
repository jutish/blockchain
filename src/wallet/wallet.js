import Transaction from './transaction';
import { elliptic, hash } from '../modules';

const INITIAL_BALANCE = 100;

class Wallet {
  constructor(blockchain, initialBalance = INITIAL_BALANCE) {
    this.balance = initialBalance;
    this.keyPair = elliptic.createKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
    this.blockchain = blockchain;
  }

  toString() {
    const { balance, publicKey } = this;

    return `Wallet - 
      publicKey : ${publicKey}
      balance   : ${balance}
    `;
  }

  sign(data) {
    return this.keyPair.sign(hash(data));
  }

  createTransaction(recipientAddress, amount) {
    const { currentBalance, blockchain: { memoryPool } } = this;

    if (amount > currentBalance) throw Error(`Amount: ${amount} exceds current balance: ${currentBalance}`);

    let tx = memoryPool.find(this.publicKey);
    if (tx) {
      tx.update(this, recipientAddress, amount);
    } else {
      tx = Transaction.create(this, recipientAddress, amount);
      memoryPool.addOrUpdate(tx);
    }

    return tx;
  }

  get currentBalance() {
    const { blockchain: { blocks = [] }, publicKey } = this;
    let { balance } = this;
    const txs = []; // Guarda todas las transacciones de la blockchain

    // En el campo data de cada bloque figuran las transacciones ya minadas.
    // El bloque genesis en ese campo tiene un texto por eso hay que solo tener en cuenta donde data es un array.
    blocks.forEach(({ data = [] }) => {
      if (Array.isArray(data)) data.forEach((tx) => txs.push(tx));
    });

    // Buscar los inputs de nuestra wallet
    const walletInputsTxs = txs.filter((tx) => tx.input.address === publicKey);
    let timestamp = 0;
    // Chequeo que al menos hayamos enviado dinero una vez y obtengo la ultima Tx que firmamos
    if (walletInputsTxs.length > 0) {
      const recentInputTx = walletInputsTxs
        .sort((a, b) => a.input.timestamp - b.input.timestamp) // Una forma facil de ordenar por fecha
        .pop(); // Orden las transacciones por fecha y me quedo con la ultima haciendo un pop()

      // De la ultima transaccion veo los outputs y busco mi publicKey dado que ahi figura el balance actualizado
      balance = recentInputTx.outputs.find(({ address }) => address === publicKey).amount;
      // Nos quedamos con el timestamp de la ultima Tx, porque despues buscamos aquellas posteriores donde recibimos dinero.
      timestamp = recentInputTx.input.timestamp;
    }

    txs
      .filter(({ input }) => input.timestamp > timestamp) // Me quedo con las Txs posteriores al ultimo pago que realize
      .forEach(({ outputs }) => { // Por cada Tx donde soy el receptor sumo el amount al balance
        outputs.forEach(({ address, amount }) => {
          if (address === publicKey) balance += amount; // Aca yo soy el receptor
        });
      });

    return balance;
  }
}

export { INITIAL_BALANCE };
export default Wallet;
