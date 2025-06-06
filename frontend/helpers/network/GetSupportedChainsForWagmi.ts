import { Chain } from 'wagmi';

export const westendAssetHub: Chain = {
  id: 420420421,
  name: 'Westend Asset Hub',
  network: 'westend',
  nativeCurrency: {
    decimals: 18,
    name: 'Westend',
    symbol: 'WND',
  },
  rpcUrls: {
    default: {
      http: ['https://westend-asset-hub-eth-rpc.polkadot.io'],
    },
    public: {
      http: ['https://westend-asset-hub-eth-rpc.polkadot.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://blockscout-asset-hub.parity-chains-scw.parity.io',
    },
  },
};

export const GetSupportedChainsForWagmi = () => {
  return [westendAssetHub];
};
