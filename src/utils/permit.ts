import { getContract, getProvider, signTypedData } from '@wagmi/core'
import { ethers } from 'ethers'
import erc20Abi from './abis/erc20.json'

const PERMIT_V1 = '0xea2aa0a1be11a07ed86d755c93467f4f82362b452371d1ba94d1715123511acb'
const PERMIT_V2 = '0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9'

export const erc721PermitSignature = async (owner: string, spender: string, value: string, contract: any) => {
  try {
    const transactionDeadline = Date.now() + 86400 * 100
    const nonce = await contract.nonces(owner)
    const contractName = await contract.name()
    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ]
    const domain = {
      name: contractName,
      version: '2',
      chainId: 1,
      verifyingContract: contract.address,
    }
    const Permit = [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ]
    const message = {
      owner,
      spender,
      value,
      nonce: nonce.toHexString(),
      deadline: transactionDeadline,
    }

    const signature = await signTypedData({
      domain,
      types: {
        EIP712Domain,
        Permit,
      },
      value: message,
    })

    const signData = ethers.utils.splitSignature(signature as string)
    const { r, s, v } = signData
    return {
      signature,
      data: {
        r,
        s,
        v,
        value: message.value,
        owner: message.owner,
        spender: message.spender,
        deadline: transactionDeadline,
      },
    }
  } catch (e) {
    throw Error(`${e}`)
  }
}

export const contractHasPermit = async (address: string, chainId: number) => {
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
