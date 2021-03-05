import Wallet from './wallet';
import Transaction from './transaction';

const blockchainWallet = new Wallet(); // Esta se crea exclusivamente para pagarle a los miners.

export { Transaction, blockchainWallet };
export default Wallet;
