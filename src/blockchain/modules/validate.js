import Block from '../block';

export default (blockchain) => {
  const [genesisBlock, ...blocks] = blockchain; // uso split operator y divido por un lado el Genesis y por otro el resto de los bloques.

  if (JSON.stringify(genesisBlock) !== JSON.stringify(Block.genesis)) throw Error('Invalid Genesis Block'); // Verifico que el genesis no haya sido modificado. Dado que el genesis block se genera igual para todas las cadenas.
  // Por cada bloque de la cadena pasada por parametro verifico que el bloque actual apunte al bloque anterior y que el hash actual sea valido, es decir que no se haya modificado el bloque.
  for (let i = 0; i < blocks.length; i += 1) { // por cada bloque en bloque en blocks, obtengo su informacion y chequeo.
    const {
      previousHash,
      timestamp,
      hash,
      data,
      nonce,
      difficulty,
    } = blocks[i];
    const previousBlock = blockchain[i];// Obtengo el bloque previo. blockchain[i] es el previo ya que inicia con el genesis, en cambio en blocks[i] es el actual.

    // El bloque actual debe apuntar al Hash del bloque anterior.
    if (previousHash !== previousBlock.hash) throw Error('Invalid previous Hash'); // Si el atributo previousHash del bloque actual es diferente al Hash del bloque anterior hay error.
    // El hash del bloque actual debe ser correcto. Para eso comparo el hash del bloque actual con el devuelto por la funcion Hash en base a los datos del bloque.
    if (hash !== Block.hash(timestamp, previousHash, data, nonce, difficulty)) throw Error('Invalid Hash');
  }

  return true;
};
