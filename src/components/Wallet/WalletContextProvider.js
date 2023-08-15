import { FC, ReactNode, useCallback, useMemo } from 'react';
import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider as ReactUIWalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    //TorusWalletAdapter,
    SlopeWalletAdapter,
    SolongWalletAdapter,
    BackpackWalletAdapter,
    BraveWalletAdapter,
    Coin98WalletAdapter,
    CoinbaseWalletAdapter,
    NightlyWalletAdapter,
    TrustWalletAdapter, 
    //WalletConnectWalletAdapter,
    XDEFIWalletAdapter
} from '@solana/wallet-adapter-wallets';
require('@solana/wallet-adapter-react-ui/styles.css');


const WalletContextProvider = ({ children }) => {
    const network = process.env.REACT_APP_WALLET_ADAPTER_NETWORK == 'dev' ? WalletAdapterNetwork.Devnet : WalletAdapterNetwork.Mainnet;
      
    const endpoint = useMemo(() => process.env.REACT_APP_WALLET_ADAPTER_NETWORK, [network]);
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new BackpackWalletAdapter(),
            new SolflareWalletAdapter(),
            //new TorusWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolongWalletAdapter(),
            new BraveWalletAdapter(),
            new Coin98WalletAdapter(),
            new CoinbaseWalletAdapter(),
            new NightlyWalletAdapter(),
            new TrustWalletAdapter(), 
            //new WalletConnectWalletAdapter(),
            new XDEFIWalletAdapter()
        ],
        [network]
    );

    const onError = useCallback(
        (error) => {
            console.error(error);
        },
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} onError={onError} autoConnect>
                <ReactUIWalletModalProvider>{children}</ReactUIWalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default WalletContextProvider;