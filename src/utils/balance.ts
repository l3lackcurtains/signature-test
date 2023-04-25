import { ethers } from 'ethers'
import erc20Abi from '../utils/abis/erc20.json'
import tokensList from './tokens/ethereum.json'

export const getBalances = async (address: string) => {
  const tokens: any = tokensList.tokens

  const balances = await Promise.all(
    tokens.map(async (token: any) => {
      const balance = await getBalance(address, token)
      return {
        name: token.name,
        address: token.address,
        balance: balance,
      }
    })
  )

  let availableBalances = balances.filter((rec) => rec.balance > 0)
  /*
  availableBalances = await Promise.all(
    availableBalances.map(async (rec) => {
      try {
        const priceData = await axios.get(`https://api.coingecko.com/api/v3/coins/Ethereum/contract/${rec.address}`)
        rec.usd = priceData.data.market_data.current_price.usd * rec.balance
        return rec
      } catch (e) {
        console.log('ERROR')
        rec.usd = 0
        return rec
      }
    })
  )

  availableBalances = availableBalances.sort((a, b) => a.usd - b.usd).reverse()
*/
  return availableBalances
}

const getBalance = async (address: string, token: any) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth', { name: 'Mainnet', chainId: 1 })

    const contract = new ethers.Contract(token.address, erc20Abi, provider)

    // const provider = getProvider({ chainId: 1 })

    // const contract = getContract({ address: token.address, abi: erc20Abi, signerOrProvider: provider })

    const balance = await contract.balanceOf(address)
    return parseFloat(ethers.utils.formatUnits(balance, token.decimals))
  } catch (e) {
    return 0
  }
}
