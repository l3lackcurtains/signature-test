import { getContract, getProvider } from '@wagmi/core'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

import erc20Abi from '../../utils/abis/erc20.json'

const PERMIT_V1 = '0xea2aa0a1be11a07ed86d755c93467f4f82362b452371d1ba94d1715123511acb'
const PERMIT_V2 = '0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9'

const ETHEREUM_API = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/tokenlist.json'
const BINANCE_API = 'https://raw.githubusercontent.com/trustwallet/assets/92126bb488ff43acd7c4e960f9b488266b5c8744/blockchains/binance/tokenlist.json'
const POLYGON_API = 'https://raw.githubusercontent.com/trustwallet/assets/b8058558b189ce5cb540c50d673b36c59fe383f0/blockchains/polygon/tokenlist.json'

async function listTokens() {
  const res = await axios.get(POLYGON_API)

  let tokens = res.data.tokens

  tokens = await Promise.all(
    tokens.map(async (token: any) => {
      const x = await contractHasPermit(token.address, 137)
      return {
        name: token.name,
        symbol: token.symbol,
        address: token.address,
        decimals: token.decimals,
        chainId: token.chainId,
        permitVersion: x,
      }
    })
  )

  return tokens
}

const contractHasPermit = async (address: string, chainId: number) => {
  try {
    const provider = getProvider({
      chainId: chainId || 1,
    })

    const contract = getContract({
      address,
      abi: erc20Abi,
      signerOrProvider: provider,
    })

    const x = await contract.PERMIT_TYPEHASH()
    if (x) {
      if (x === PERMIT_V1) return 1
      if (x === PERMIT_V2) return 2
      return 0
    }
  } catch (e) {
    return 0
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const tokens = await listTokens()

  res.status(200).json({ tokens })
}
