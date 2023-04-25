import type { NextApiRequest, NextApiResponse } from 'next'
import { getBalances } from 'utils/balance'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const address = req.query.address as string
  const chain: string = req.query.chain?.toString() || 'eth'

  const balances = await getBalances(address, chain)

  res.status(200).json(balances)
}
