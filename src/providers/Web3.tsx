import { useColorMode } from '@chakra-ui/react'
import { bsc, mainnet, polygon } from '@wagmi/core/chains'
import { ConnectKitProvider, getDefaultClient } from 'connectkit'
import { ReactNode } from 'react'
import { SITE_NAME } from 'utils/config'
import { WagmiConfig, configureChains, createClient } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'

interface Props {
  children: ReactNode
}

const SUPPORTED_CHAINS = [polygon, bsc, mainnet]
const { provider, webSocketProvider } = configureChains(SUPPORTED_CHAINS, [
  publicProvider(),
  jsonRpcProvider({
    rpc: () => ({
      http: `https://rpc.ankr.com/eth`,
    }),
  }),
])

const client = createClient(
  getDefaultClient({
    appName: SITE_NAME,
    autoConnect: true,
    chains: SUPPORTED_CHAINS,
    provider,
    webSocketProvider,
  })
)

export function Web3Provider(props: Props) {
  const { colorMode } = useColorMode()

  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider mode={colorMode}>{props.children}</ConnectKitProvider>
    </WagmiConfig>
  )
}
