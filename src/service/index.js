import express from 'express';
import bodyParser from 'body-parser';
import Blockchain from '../blockchain';
import P2PService from './p2p';
import Wallet from '../wallet';

const {HTTP_PORT = 3000} = process.env; //Si HTTP_PORT no esta en el ambiente, toma 3000 por defecto.

const app = express(); //Creamos una nueva app de express()
const blockchain = new Blockchain(); //Instanciamos una nueva Blockchain
const wallet = new Wallet(blockchain);
const p2pService = new P2PService(blockchain); //Instanciamos P2PService y le pasamos la blockchain.

app.use(bodyParser.json()); //Usamose el middleware BodyParser

app.get('/blocks',(req,res)=>{
	res.json(blockchain.blocks)
});

app.post('/mine',(req,res)=>{
	const{body:{data}} = req; //Descompongo el body y de body obtengo un parametro llamado data.
	const block = blockchain.addBlock(data) //Creo un nuevo bloque usando la variable data
	p2pService.sync(); //Luego de agregar un nuevo bloque a mi blockchain envio mi blockchain al resto de los nodos conectados a mi.
	res.json({
		blocks: blockchain.blocks.length,
		block,
	});
});

app.get('/transactions', (req, res) => {
	const { memoryPool: { transactions } } = blockchain;
	res.json(transactions);
});

app.post('/transaction',( req, res) => {
	const { body: { recipient, amount } } = req;
	try{
		const tx = wallet.createTransaction(recipient, amount);
		res.json(tx);
	}catch (error){
		res.json({ error: error.message });
	}

});

app.listen(HTTP_PORT, ()=>{
	console.log(`Service HTTP: ${HTTP_PORT} listening..`)
	p2pService.listen();
});
