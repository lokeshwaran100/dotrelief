import { connectorsForWallets, Wallet } from "@rainbow-me/rainbowkit";
import { createClient, configureChains, Connector } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { TalismanConnector } from "./TalismanConnector";
import { westendAssetHub } from "../network/GetSupportedChainsForWagmi";

// Define supported chains
const supportedChains = [westendAssetHub];

export const { provider, webSocketProvider } = configureChains(
  supportedChains,
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: chain.rpcUrls.default.http[0],
      }),
    }),
  ],
);

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
          window.open('https://talisman.xyz/download', '_blank');
          return '';
        }
      },
      qrCode: {
        getUri: async () => {
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

// Only use Talisman wallet
const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
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
