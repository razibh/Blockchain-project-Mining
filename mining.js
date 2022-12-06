const sha256 = require("crypto-js/sha256");
const { base } = require("elliptic/lib/elliptic/curve");

class Block {
    constructor(timestamp, transactions, previoushash = "") {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previoushash = previoushash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Mining DOne : " + this.hash);
    }
    calculateHash() {
        return sha256(this.timestamp + JSON.stringify(this.transactions) + this
            .previoushash + this.nonce).toString();
    }
    hasValidTransactions()
    {
        for (const tx of this.transactions)
        {
            if (!tx.isValid())
            {
                return false;
            }
        }
        return true;
    }
}

class Transaction {
    constructor(fromAddress, toAddaress, amount) {
        this.fromAddress = fromAddress;
        this.toAddaress = toAddaress;
        this.amount = amount;
    }
    calculateHash()
    {
        return sha256(this.fromAddress + this.toddress + this.amount);
    }
    signTransaction(key)
    {
         if (key.grtPublic("hex") !== this.fromAddress)
         {
            throw new Error("You do not have access");
         }
         const hashTx = this.calculateHash();
         const singnature = key.sign(hashTx,"base64");
         this.singnature = singnature.toDER();
    }
    isValid()
    {
        if (this.fromAddress === null)true;
        if(!this.singnature || this.singnature.length ===0)
        {
            throw new Error("NO signture found");
        }
        const key= ec.keyFromPublic(this.fromAddress,"hex");
       return key.verify(this.calculateHash(), this.singnature);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.generateGenesisBlock()];
        this.difficulty = 5;
        this.pendingTransactins = [];
    }

    generateGenesisBlock() {
        return new Block("2022-12-05", "GENESIS", "0000 ");
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addTransaction(transaction) {
        if (!transaction.fromAddress || !transaction.toAddaress)
        {
            throw new Error ("Cannot process transactions");
        }
        if (!transaction.isValid())
        {
            throw new Error("Invalied transactions");
        }
        
        this.pendingTransactins.push(transaction)
    }

    minePendingTransactions() {
        let block = new Block(Date.now(), this.pendingTransactins);
        block.mineBlock(this.difficulty);
        this.chain.push(block);
        this.pendingTransactins = [];
    }

    isBlockchainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const CurrantBlock = this.chain[i];
            const previoushBlock = this.chain[i - 1];
            if (CurrantBlock.hash !== CurrantBlock.calculateHash()) {
                return false;
            }
            if (CurrantBlock.previoushash !== previoushBlock.hash) {
                return false;
            }
            if (!CurrantBlock.hasValidTransactions())
            {
                return false;
            }
        }
        return true;
    }
    getBalanceOfAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {

                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddaress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }
}

const josscoin = new Blockchain();
josscoin.addTransaction(new Transaction("Address1", "Address2", 1000));
josscoin.addTransaction(new Transaction("Address2", "Address1", 5000));
josscoin.minePendingTransactions();
console.log(josscoin.getBalanceOfAddress("Address1"));
console.log(josscoin.getBalanceOfAddress("Address2"));
console.log(josscoin);


