import type { NextApiRequest, NextApiResponse } from 'next'
import { getBalances } from 'utils/balance'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const address = req.query.address as string

  const balances = await getBalances(address)

  res.status(200).json(balances)
}
