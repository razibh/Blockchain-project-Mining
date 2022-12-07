const { Block, Transaction, Blockchain } = require("./mining");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

const key1 = ec.genKeyPair();
const privateKey1 = key1.getPrivate("hex");
const walletNumber1 = key1.getPublic("hex");
const key2 = ec.genKeyPair();
const privateKey2 = key2.getPrivate("hex");
const walletNumber2 = key2.getPublic("hex");
const josscoin = new Blockchain();


const tx1 = new Transaction(walletNumber1, walletNumber2, -100);
tx1.signTransaction(key1);
josscoin.addTransaction(tx1);
josscoin.minePendingTransactions(walletNumber1);
console.log(josscoin.getBalanceOfAddress(walletNumber1));

josscoin.minePendingTransactions(walletNumber1);
console.log(josscoin.getBalanceOfAddress(walletNumber1));

console.log(josscoin.isBlockchainValid());