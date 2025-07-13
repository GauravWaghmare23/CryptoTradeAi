import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWeb3 } from "@/hooks/useWeb3";
import { Wallet, ExternalLink, Power, Loader2 } from "lucide-react";

export const WalletConnect = () => {
  const {
    account,
    isConnected,
    isConnecting,
    chainId,
    balance,
    connectWallet,
    disconnectWallet,
    isMetaMaskInstalled,
  } = useWeb3();

  if (!isMetaMaskInstalled) {
    return (
      <Card className="p-6 bg-warning/10 border-warning/20">
        <div className="flex items-center space-x-3">
          <Wallet className="w-6 h-6 text-warning" />
          <div>
            <h3 className="font-semibold text-foreground">MetaMask Required</h3>
            <p className="text-sm text-muted-foreground">
              Please install MetaMask to use Web3 features
            </p>
          </div>
          <Button 
            variant="outline" 
            asChild
            className="ml-auto"
          >
            <a 
              href="https://metamask.io/download/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2"
            >
              <span>Install MetaMask</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </Card>
    );
  }

  if (!isConnected) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center mx-auto">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-muted-foreground">
              Connect your MetaMask wallet to start trading and earn SHM tokens
            </p>
          </div>
          <Button 
            onClick={connectWallet} 
            disabled={isConnecting}
            className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <p className="font-semibold text-foreground">
                {account?.slice(0, 6)}...{account?.slice(-4)}
              </p>
              <Badge 
                variant={chainId === 8081 ? "default" : "destructive"}
                className="text-xs"
              >
                {chainId === 8081 ? "Shardeum" : `Chain ${chainId}`}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Balance: {balance ? `${parseFloat(balance).toFixed(4)} SHM` : "Loading..."}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            asChild
          >
            <a 
              href={`https://explorer-sphinx.shardeum.org/account/${account}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Explorer</span>
            </a>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={disconnectWallet}
            className="text-destructive hover:text-destructive"
          >
            <Power className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
};