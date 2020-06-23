import Web3 from "web3";

const web3 = new Web3();

const privateKey = "0x896b00b5d9a4fa07b049f9fc4d3365fff485dfd6414b3a51d0cfbdcee58c8caf";
const account = web3.eth.accounts.privateKeyToAccount(privateKey);

console.log(account);