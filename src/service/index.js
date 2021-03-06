import express from 'express';
import bodyParser from 'body-parser';
import Blockchain from '../blockchain';
import P2PService, { MESSAGE } from './p2p';
import Wallet from '../wallet';
import Miner from '../miner';

const { HTTP_PORT = 3000 } = process.env; // Si HTTP_PORT no esta en el ambiente, toma 3000 por defecto.

const app = express(); // Creamos una nueva app de express()
const blockchain = new Blockchain(); // Instanciamos una nueva Blockchain
const wallet = new Wallet(blockchain);
const walletMiner = new Wallet(blockchain, 0);
const p2pService = new P2PService(blockchain); // Instanciamos P2PService y le pasamos la blockchain.
const miner = new Miner(blockchain, p2pService, walletMiner);

app.use(bodyParser.json()); // Usamose el middleware BodyParser

app.get('/blocks', (req, res) => {
  res.json(blockchain.blocks);
});

// Este metodo al final del curso lo borra ya que el minado se hace en realidad desde MemoryPool
// app.post('/mine', (req, res) => {
//   const { body: { data } } = req; // Descompongo el body y de body obtengo un parametro llamado data.
//   const block = blockchain.addBlock(data); // Creo un nuevo bloque usando la variable data
//   p2pService.sync(); // Luego de agregar un nuevo bloque a mi blockchain envio mi blockchain al resto de los nodos conectados a mi.
//   res.json({
//     blocks: blockchain.blocks.length,
//     block,
//   });
// });

// Genera una nueva wallet y devuelve la Public Key
app.get('/wallet', (req, res) => { 
  const { publicKey } = new Wallet(blockchain);
  return res.json({ publicKey });
})

app.get('/transactions', (req, res) => {
  const { memoryPool: { transactions } } = blockchain;
  res.json(transactions);
});

app.post('/transaction', (req, res) => {
  const { body: { recipient, amount } } = req;
  try {
    const tx = wallet.createTransaction(recipient, amount);
    p2pService.broadcast(MESSAGE.TX, tx);
    res.json(tx);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.get('/mine/transactions', (req, res) => {
  try {
    miner.mine();
    res.redirect('/blocks');
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.listen(HTTP_PORT, () => {
  console.log(`Service HTTP: ${HTTP_PORT} listening..`);
  p2pService.listen();
});
