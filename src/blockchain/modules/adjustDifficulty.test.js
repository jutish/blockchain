import adjustDifficulty from './adjustDifficulty';

describe('adjustDifficulty',()=>{
	let block;

	beforeEach(()=>{
		block = { timestamp: Date.now(),difficulty: 3 }; //En lugar de crear un nuevo bloque paso solo lo que usa la funcion.
	});

	it('lowers the difficulty for slowly mined blocks', () => {
		expect(adjustDifficulty(block,block.timestamp + 60000)).toEqual(block.difficulty - 1);
	});

	it('increments the difficulty for quick mined blocks',() => {
		expect(adjustDifficulty(block,block.timestamp + 1000)).toEqual(block.difficulty + 1);
	});

});