import WebSocket from 'ws'

const {P2P_PORT = 5000, PEERS} = process.env; //PEERS es una variable de entorno que tiene un String de nodos (URL) por defecto separdos por coma donde poder conectarnos.
const peers = PEERS ? PEERS.split(',') : []; //Si PEERS tiene datos, devuelvo un Array con los peers (URL) o sino un array vacio.

class P2PService{
	constructor(blockchain){
		this.blockchain = blockchain;
		this.sockets = [] //Mantiene los sockets que se van conectando al servidor. 
	}

	listen(){
		const server = new WebSocket.Server({ port: P2P_PORT }); //Crea un Server WebSocket
		server.on('connection',(socket)=>{this.onConnection(socket)});

		console.log(PEERS)

		peers.forEach((peer)=>{ //Me conecto a una lista de peers y me agrego a la misma
			const socket = new WebSocket(peer); //Esto crea un Socket Cliente
			socket.on('open',()=>{this.onConnection(socket)})
		});

		console.log(`Service ws: ${P2P_PORT} listening...`);
	}

	onConnection(socket){
		console.log('[ws:socket] connected.');
		this.sockets.push(socket); //Agrego el nuevo Socket al array Sockets
	}
}

export default P2PService;