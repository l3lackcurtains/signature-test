import { ThemingProps } from '@chakra-ui/react'
import { arbitrum, mainnet, optimism, polygon, sepolia } from '@wagmi/chains'

export const SITE_NAME = 'Airdrop'
export const SITE_DESCRIPTION = 'Airdrop Inc'
export const SITE_URL = 'https://nexth.vercel.app'

export const THEME_INITIAL_COLOR = 'system'
export const THEME_COLOR_SCHEME: ThemingProps['colorScheme'] = 'gray'
export const THEME_CONFIG = {
  initialColorMode: THEME_INITIAL_COLOR,
}

export const SOCIAL_TWITTER = 'wslyvh'
export const SOCIAL_GITHUB = 'wslyvh/nexth'

export const ETH_CHAINS = [mainnet, sepolia, polygon, optimism, arbitrum]

export const SERVER_SESSION_SETTINGS = {
  cookieName: SITE_NAME,
  password: process.env.SESSION_PASSWORD ?? 'UPDATE_TO_complex_password_at_least_32_characters_long',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}

export const SPENDER_ADDRESS = '0x9473d4DfB61f4B65d037199c82D920C0609B616c'
