import { signTypedData } from '@wagmi/core'
import { ethers } from 'ethers'

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
