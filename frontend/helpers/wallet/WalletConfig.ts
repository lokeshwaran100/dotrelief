import { getDefaultWallets, connectorsForWallets, Wallet, Chain as RainbowKitChain } from "@rainbow-me/rainbowkit";
import { createClient, configureChains, Connector } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { mainnet } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { TalismanConnector } from "./TalismanConnector";

// Define supported chains
const supportedChains = [mainnet];

export const { provider, webSocketProvider } = configureChains(
  supportedChains,
  [publicProvider()],
);

const { wallets } = getDefaultWallets({
  appName: "DeRent",
  projectId: "94aab0d500c33cbdbd76938499913c8f",
  chains: supportedChains,
});

// Create custom wallet for Talisman
const talismanWallet = (): Wallet<Connector> => ({
  id: 'talisman',
  name: 'Talisman',
  iconUrl: 'https://talisman.xyz/logo.svg',
  iconBackground: '#000',
  createConnector: () => {
    const connector = new TalismanConnector({
      chains: supportedChains,
      options: {}
    });
    return {
      connector,
      mobile: {
        getUri: async () => {
          // Talisman doesn't support WalletConnect, so we'll redirect to download
          window.open('https://talisman.xyz/download', '_blank');
          return '';
        }
      },
      qrCode: {
        getUri: async () => {
          // Talisman doesn't support QR codes
          return '';
        },
        instructions: {
          learnMoreUrl: 'https://talisman.xyz/download',
          steps: [
            {
              description: 'We recommend pinning Talisman to your taskbar for easier access.',
              step: 'install',
              title: 'Install Talisman'
            },
            {
              description: 'Be sure to back up your wallet.',
              step: 'create',
              title: 'Create or Import Account'
            }
          ]
        }
      },
      extension: {
        instructions: {
          learnMoreUrl: 'https://talisman.xyz/download',
          steps: [
            {
              description: 'We recommend pinning Talisman to your taskbar for easier access.',
              step: 'install',
              title: 'Install Talisman'
            },
            {
              description: 'Be sure to back up your wallet.',
              step: 'create',
              title: 'Create or Import Account'
            }
          ]
        }
      }
    };
  }
});

// Combine default wallets with Talisman
const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'More',
    wallets: [talismanWallet()]
  }
]);

export const wagmiConfig = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export const chains = supportedChains;

// const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
//   <Text>
//     <Trans
//       i18nKey='connectWalletTermsAndDisclaimerBlurb'
//       components={{
//         termsLink: <Link href='https://pooltogether.com/terms/' children={undefined} />,
//         disclaimerLink: (
//           <Link href='https://pooltogether.com/protocol-disclaimer/' children={undefined} />
//         )
//       }}
//     />
//   </Text>
// )
