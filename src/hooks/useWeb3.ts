import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { toast } from '@/hooks/use-toast';

interface Web3State {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;
  balance: string | null;
}

const SHARDEUM_TESTNET = {
  chainId: '0x1F93', // 8081 in hex
  chainName: 'Shardeum Testnet',
  nativeCurrency: {
    name: 'SHM',
    symbol: 'SHM',
    decimals: 18,
  },
  rpcUrls: ['https://api-testnet.shardeum.org'],
  blockExplorerUrls: ['https://explorer-sphinx.shardeum.org/'],
};

export const useWeb3 = () => {
  const [web3State, setWeb3State] = useState<Web3State>({
    account: null,
    provider: null,
    signer: null,
    isConnected: false,
    isConnecting: false,
    chainId: null,
    balance: null,
  });

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };

  // Connect to MetaMask
  const connectWallet = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      toast({
        title: 'MetaMask Required',
        description: 'Please install MetaMask to use this feature.',
        variant: 'destructive',
      });
      return;
    }

    setWeb3State(prev => ({ ...prev, isConnecting: true }));

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(accounts[0]);

      setWeb3State({
        account: accounts[0],
        provider,
        signer,
        isConnected: true,
        isConnecting: false,
        chainId: Number(network.chainId),
        balance: ethers.formatEther(balance),
      });

      toast({
        title: 'Wallet Connected',
        description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
      });

      // Switch to Shardeum Testnet if not already on it
      if (Number(network.chainId) !== 8081) {
        await switchToShardeum();
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      setWeb3State(prev => ({ ...prev, isConnecting: false }));
      toast({
        title: 'Connection Failed',
        description: error.message || 'Failed to connect to MetaMask',
        variant: 'destructive',
      });
    }
  }, []);

  // Switch to Shardeum Testnet
  const switchToShardeum = async () => {
    if (!isMetaMaskInstalled()) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SHARDEUM_TESTNET.chainId }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SHARDEUM_TESTNET],
          });
        } catch (addError) {
          toast({
            title: 'Network Error',
            description: 'Failed to add Shardeum Testnet to MetaMask',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Network Switch Failed',
          description: 'Failed to switch to Shardeum Testnet',
          variant: 'destructive',
        });
      }
    }
  };

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWeb3State({
      account: null,
      provider: null,
      signer: null,
      isConnected: false,
      isConnecting: false,
      chainId: null,
      balance: null,
    });
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected.',
    });
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== web3State.account) {
        connectWallet();
      }
    };

    const handleChainChanged = (chainId: string) => {
      setWeb3State(prev => ({ ...prev, chainId: parseInt(chainId, 16) }));
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [connectWallet, disconnectWallet, web3State.account]);

  // Auto-connect on load if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      if (!isMetaMaskInstalled()) return;

      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });

        if (accounts.length > 0) {
          await connectWallet();
        }
      } catch (error) {
        console.error('Auto-connect failed:', error);
      }
    };

    autoConnect();
  }, []);

  return {
    ...web3State,
    connectWallet,
    disconnectWallet,
    switchToShardeum,
    isMetaMaskInstalled: isMetaMaskInstalled(),
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}