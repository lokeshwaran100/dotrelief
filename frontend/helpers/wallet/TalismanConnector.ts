import { Connector, Chain } from 'wagmi';
import { westendAssetHub } from '../network/GetSupportedChainsForWagmi';

declare global {
  interface Window {
    talismanEth?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (event: string, handler: (...args: any[]) => void) => void;
    };
  }
}

export interface TalismanConnectorOptions {
  chains?: Chain[];
}

type TalismanProvider = NonNullable<Window['talismanEth']>;

export class TalismanConnector extends Connector<
  TalismanProvider,
  TalismanConnectorOptions
> {
  readonly id = 'talisman';
  readonly name = 'Talisman';
  readonly ready = typeof window !== 'undefined' && !!window.talismanEth;

  private provider?: TalismanProvider;

  constructor({ chains = [], options: _ }: { chains?: Chain[]; options: TalismanConnectorOptions }) {
    super({ chains: [westendAssetHub], options: {} });
  }

  async connect({ chainId }: { chainId?: number } = {}) {
    try {
      const provider = await this.getProvider({ chainId });
      if (!provider) throw new Error('Provider not found');

      this.emit('message', { type: 'connecting' });

      // Request access and switch to Westend chain
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${westendAssetHub.id.toString(16)}` }],
      });

      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      });

      // Ensure the account is in the correct format
      const account = accounts[0].toLowerCase() as `0x${string}`;
      
      provider.on('accountsChanged', this.onAccountsChanged);
      provider.on('chainChanged', this.onChainChanged);
      provider.on('disconnect', this.onDisconnect);

      return {
        account,
        chain: {
          id: westendAssetHub.id,
          unsupported: false
        },
        provider
      };
    } catch (error) {
      if (this.isUserRejectedRequestError(error)) {
        throw new Error('User rejected the request');
      }
      if ((error as Error).message.includes('install')) {
        window.open('https://talisman.xyz/download', '_blank');
      }
      throw error;
    }
  }

  async switchChain(chainId: number): Promise<Chain> {
    if (chainId !== westendAssetHub.id) {
      throw new Error('Chain not supported by Talisman connector');
    }
    return westendAssetHub;
  }

  async disconnect() {
    const provider = await this.getProvider();
    if (!provider) return;

    provider.removeListener('accountsChanged', this.onAccountsChanged);
    provider.removeListener('chainChanged', this.onChainChanged);
    provider.removeListener('disconnect', this.onDisconnect);
  }

  async getAccount() {
    const provider = await this.getProvider();
    if (!provider) throw new Error('Provider not found');
    const accounts = await provider.request({
      method: 'eth_accounts'
    });
    // Ensure the account is in the correct format
    return accounts[0]?.toLowerCase() as `0x${string}`;
  }

  async getChainId() {
    return westendAssetHub.id;
  }

  async getProvider({ chainId }: { chainId?: number } = {}) {
    if (typeof window === 'undefined') throw new Error('Window is undefined');
    if (this.provider) return this.provider;
    if (!window.talismanEth) throw new Error('Talisman provider not found');
    this.provider = window.talismanEth;
    return this.provider;
  }

  async getSigner() {
    const provider = await this.getProvider();
    return provider;
  }

  async isAuthorized() {
    try {
      const account = await this.getAccount();
      return !!account;
    } catch {
      return false;
    }
  }

  protected onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) this.emit('disconnect');
    else this.emit('change', { account: accounts[0].toLowerCase() as `0x${string}` });
  };

  protected onChainChanged = (chainId: string | number) => {
    const id = normalizeChainId(chainId);
    const unsupported = id !== westendAssetHub.id;
    this.emit('change', { chain: { id, unsupported } });
  };

  protected onDisconnect = () => {
    this.emit('disconnect');
  };

  protected isUserRejectedRequestError(error: unknown) {
    return (error as Error).message.toLowerCase().includes('user rejected');
  }
}

function normalizeChainId(chainId: string | number | bigint) {
  if (typeof chainId === 'string')
    return Number.parseInt(
      chainId,
      chainId.trim().substring(0, 2) === '0x' ? 16 : 10
    );
  if (typeof chainId === 'bigint') return Number(chainId);
  return chainId;
} 