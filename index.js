import PKG from './package.json';
import Block from './src/blockchain/block';

const{name, version, author}  = PKG;
console.log(`${name} v${version} - Author: ${author}`);

const {genesis} = Block;
console.log(genesis.toString());

const block1 = Block.mine(genesis,'d4t4-block1');
console.log(block1.toString());

const block2 = Block.mine(block1,'d4t4-block2');
console.log(block2.toString());