import express from 'express';
import bodyParser from 'body-parser';
import Blockchain from '../blockchain';
import P2PService from './p2p';

const {HTTP_PORT = 3000} = process.env; //Si HTTP_PORT no esta en el ambiente, toma 3000 por defecto.

const app = express(); //Creamos una nueva app de express()
const blockchain = new Blockchain(); //Instanciamos una nueva Blockchain
const p2pService = new P2PService(blockchain); //Instanciamos P2PService y le pasamos la blockchain.

app.use(bodyParser.json()); //Usamose el middleware BodyParser

blockchain.addBlock('express');

app.get('/blocks',(req,res)=>{
	res.json(blockchain.blocks)
});

app.post('/mine',(req,res)=>{
	const{body:{data}} = req; //Descompongo el body y de body obtengo un parametro llamado data.
	const block = blockchain.addBlock(data) //Creo un nuevo bloque usando la variable data
	res.json({
		blocks: blockchain.blocks.length,
		block,
	});
});

app.listen(HTTP_PORT, ()=>{
	console.log(`Service HTTP: ${HTTP_PORT} listening..`)
	p2pService.listen();
});
