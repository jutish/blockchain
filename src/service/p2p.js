import WebSocket from 'ws'

const {P2P_PORT = 5000, PEERS} = process.env; //PEERS es una variable de entorno que tiene un String de nodos (URL) por defecto separdos por coma donde poder conectarnos.
const peers = PEERS ? PEERS.split(',') : []; //Si PEERS tiene datos, devuelvo un Array con los peers (URL) o sino un array vacio.
const MESSAGE = {
	BLOCKS: 'blocks',
    TX: 'transaction', 
     : 'wipe_memorypool',
}; //Creo una constante para tipificar los distintos tipos de mensajes que vamos a ir pasando

class P2PService{
	constructor(blockchain){
		this.blockchain = blockchain;
		this.sockets = [] //Mantiene los sockets que se van conectando al servidor. 
	}

	listen(){
		const server = new WebSocket.Server({ port: P2P_PORT }); //Crea un Server WebSocket
		server.on('connection',(socket)=>{this.onConnection(socket)}); //Cuando un socket se conecta a este server lo agrega a la lista this.sockets[]

		peers.forEach((peer)=>{ //Me conecto a una lista de peers y me agrego a la misma
			const socket = new WebSocket(peer); //Esto crea un Socket Cliente
			socket.on('open',()=>{this.onConnection(socket)}) //Cuando me conecto a un server de PEERS agegro esa conexion a this.sockets[]
		});

		console.log(`Service ws: ${P2P_PORT} listening...`);
	}

	//Cuando alguien se conecta a mi o yo me conecto a alguien se ejecuta este metodo.
	onConnection(socket){
		const { blockchain } = this;

		console.log('[ws:socket] connected.');
		this.sockets.push(socket); //Agrego el nuevo Socket al array Sockets
		//Para saber si recibo un mensaje me suscribo a la accion "message"
		socket.on('message', (message) => {
			const { type, value } = JSON.parse(message); //Con parse, paso el texto recibido a Json.
			
			try{ //Uso Try/Catch porque el metodo .replace puede lanzar alguna excepcion
				if (type === MESSAGE.BLOCKS) blockchain.replace(value); //Si recibo un mensaje del tipo BLOCKS en value vienen los bloques
				else if (type === MESSAGE.TX) blockchain.memoryPool.addOrUpdate(value);
				else if (type === MESSAGE.WIPE) blockchain.memoryPool.wipe(); //cuando se reciba este mensaje se borra la memory pool
			}catch(error){
				console.log(`[ws:message] error ${error}`);
				throw Error(error);
			}
		});
		//Cuando me conecto o se conectan a mi les voy a enviar la lista de bloques que tenemos.
		socket.send(JSON.stringify({type:MESSAGE.BLOCKS, value:blockchain.blocks })); //Con stringify paso el Json a texto
	}

	broadcast(type,value){
		console.log(`[ws:broadcast] ${ type }...`);
		const message = JSON.stringify({ type, value });
		this.sockets.forEach((socket)=>{socket.send(message)});
	}

	//Se usa cuando queremos comunicar a toda la red los bloques que tenemos
	sync(){
		const {blockchain:{blocks}} = this;
		this.broadcast(MESSAGE.BLOCKS,blocks);
	}
}

export { MESSAGE }; //Lo exporto porque en el servicio HTTP vamos a usar estos mensajes.
export default P2PService;