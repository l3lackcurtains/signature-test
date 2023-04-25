import axios from 'axios'

export const getBalances = async (address: string, chain: string) => {
  try {
    const balanceList = await axios.get(`https://api.debank.com/token/balance_list?user_addr=${address}&chain=${chain}`)

    let balanceListData = balanceList.data.data

    balanceListData = balanceListData.filter((rec: any) => rec.amount > 0)

    balanceListData = balanceListData.map((rec: any) => {
      return {
        name: rec.symbol,
        address: rec.id,
        amount: rec.amount,
        usd: rec.amount * rec.price,
      }
    })

    balanceListData = balanceListData.sort((a: any, b: any) => a.usd - b.usd).reverse()

    return balanceListData
  } catch (error) {
    console.log(error)
    return []
  }
}
