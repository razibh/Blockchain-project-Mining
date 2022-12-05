const sha256 = require("crypto-js/sha256")
class Block{
    constructor(timestamp,data, previoushash = ""){
        this.timestamp = timestamp;

        this.data = data;
        this.previoushash = previoushash;
        this.hash = this.calculateHash();
        this.nonce =0;
    }
    mineBlock(difficulty)
    {
        while(this.hash.substring(0, difficulty) !== Array(difficulty +1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Mining DOne : "+ this.hash);
    }
    calculateHash(){
        return sha256( this.timestamp + JSON.stringify(this.data) + this
        .previoushash + this.nonce).toString();
    }
}

class Blockchain {
    constructor (){
        this.chain = [this.generateGenesisBlocl()];
        this.difficulty =5;
}
generateGenesisBlocl(){
    return new Block("2022-12-05", "GENESIS", "0000 ");
}
    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }
    addBlock(newBlock){
        newBlock.previoushash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    
}
    isBlockchainValid(){
        for (let i=1; i<this.chain.length; i++)
        {
            const  CurrantBlock = this.chain[i];
            const previoushBlock = this.chain[i-1];
            if ( CurrantBlock.hash !== CurrantBlock.calculateHash())
            {
                return false;
            }
            if (CurrantBlock.previoushash !== previoushBlock.hash)
            {
                return false;
            }
        }
        return true;
    }
    }

const josscoin = new Blockchain();
const block1 =new Block("2022-12-04", { amount: 5 } );
josscoin.addBlock(block1);
const block2 =new Block("2022-12-05", { amount: 10 } );
josscoin.addBlock(block2);
console.log(josscoin);


 