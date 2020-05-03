import { ethers } from 'ethers'
import { LENDING_ABI, STANDARD_ERC20_ABI } from 'service/constant'

const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC)
let lendingAddress = ''

export const getBalance = async (address) => {
  const weiBalance = await provider.getBalance(address)
  const ethBalance = ethers.utils.formatEther(weiBalance, { commify: true, pad: true })
  return ethBalance
}

export const bigNumberify = (num) => {
  return ethers.utils.bigNumberify(num)
}

export const ERC20TokenInfo = async (tokenAddress) => {
  try {
    const tokenContract = new ethers.Contract(tokenAddress, STANDARD_ERC20_ABI, provider)
    const name = await tokenContract.name()
    const symbol = await tokenContract.symbol()
    // const decimals = await tokenContract.decimals()
    const total_supply = await tokenContract.totalSupply().then((BNresult) => BNresult.toString(10))
    const tokenInfo = {
      name,
      symbol,
      logo: '',
      address: tokenAddress,
      total_supply,
    }
    return tokenInfo
  } catch (e) {
    return undefined
  }
}

const networkInformation = () => {
  let endpoint = process.env.REACT_APP_RPC
  return new Promise(async (resolve, reject) => {

    try {
      const jsonrpc = {
        jsonrpc: '2.0',
        method: 'posv_networkInformation',
        params: [ ],
        id: 1
      }

      let url = endpoint
      let options = {
        method: 'POST',
        url: url,
        json: true,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(jsonrpc)
      }
      fetch(url, options).then(async (res) => {
        let body = await res.json()
        return resolve(body.result)

      })
    } catch(e) {
      return reject(e)
    }
  })
}

export const lendingInfo = async (coinbase) => {
  try {
    lendingAddress = lendingAddress || (await networkInformation()).LendingAddress
    const lendingContract = new ethers.Contract(lendingAddress, LENDING_ABI, provider)
    const lending = await lendingContract.functions.getLendingRelayerByCoinbase(coinbase)

    let ret = {}
    ret.lendingTradeFee = lending[0]/100
    ret.lendingTokens = lending[1]
    ret.lendingTerms = lending[2].map(t => t.toString(10))
    ret.collateralTokens = lending[3]

    return ret

  } catch (e) {
    console.log(e)
    return undefined
  }
}

export const lendingPairs = async () => {
  try {
    lendingAddress = lendingAddress || (await networkInformation()).LendingAddress
    const lendingContract = new ethers.Contract(lendingAddress, LENDING_ABI, provider)

    let i = 0
    let bases = []
    try {
      while (bases.length === i) {
        let base = await lendingContract.functions.BASES(i)
        if (base) {
          bases.push(base)
        }
        i++
      }
    } catch (e) {
      // nothing
    }

    i = 0
    let terms = []
    try {
      while (terms.length === i) {
        let term = await lendingContract.functions.TERMS(i)
        if (term) {
          terms.push(term.toString(10))
        }
        i++
      }
    } catch (e) {
      // nothing
    }

    return {terms, bases}

  } catch (e) {
    console.log(e)
    return undefined
  }
}

export const validateCoinbase = (address, callback) => {
  try {
    const checksum = ethers.utils.getAddress(address)
    return callback(checksum)
  } catch (e) {
    return callback(false)
  }
}

export const toWei = (number) => {
  const stringified = number.toString()
  return ethers.utils.parseEther(stringified)
}

export const fromWei = (number) => {
  const stringified = typeof number === 'string' ? number : number.toString()
  const toEth = ethers.utils.formatEther(stringified)
  return toEth
}
