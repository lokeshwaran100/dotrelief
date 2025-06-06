import { Connector, Chain } from 'wagmi';

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

  #provider?: TalismanProvider;

  constructor({ chains = [], options: _ }: { chains?: Chain[]; options: TalismanConnectorOptions }) {
    super({ chains, options: {} });
  }

  async connect({ chainId }: { chainId?: number } = {}) {
    try {
      const provider = await this.getProvider();
      if (!provider) throw new Error('Provider not found');

      this.emit('message', { type: 'connecting' });

      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      });

      // Ensure the account is in the correct format
      const account = accounts[0].toLowerCase() as `0x${string}`;
      
      provider.on('accountsChanged', this.onAccountsChanged);
      provider.on('chainChanged', this.onChainChanged);
      provider.on('disconnect', this.onDisconnect);

      // Get initial chain id
      const id = await this.getChainId();
      const unsupported = this.isChainUnsupported(id);

      return {
        account,
        chain: {
          id,
          unsupported
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
    const provider = await this.getProvider();
    if (!provider) throw new Error('Provider not found');
    const chainId = await provider.request({
      method: 'eth_chainId'
    });
    return Number(chainId);
  }

  async getProvider() {
    if (typeof window === 'undefined') return;
    if (this.#provider) return this.#provider;
    this.#provider = window.talismanEth;
    return this.#provider;
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
    const unsupported = this.isChainUnsupported(id);
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