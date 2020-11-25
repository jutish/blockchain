import express from 'express';
import bodyParser from 'body-parser';
import Blockchain from '../blockchain';

const {HTTP_PORT = 3000} = process.env; //Si HTTP_PORT no esta en el ambiente, toma 3000 por defecto.
const app = express(); //Creamos una nueva app de express()
const blockchain = new Blockchain(); //Instanciamos una nueva Blockchain
app.use(bodyParser.json()); //Usamose el middleware BodyParser

blockchain.addBlock('express');

app.get('/blocks',(req,res)=>{
	res.json(blockchain.blocks)
});


app.listen(HTTP_PORT, ()=>{
	console.log(`Service HTTP: ${HTTP_PORT} listening`)
});