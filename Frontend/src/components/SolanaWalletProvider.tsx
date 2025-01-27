"use client"; 
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider as ReactUIWalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
    PhantomWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { ReactNode } from 'react';
import '@solana/wallet-adapter-react-ui/styles.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { endpoint } from '../anchor/setup';

const SolanaWalletProvider = ({ children }: { children: ReactNode }) => {
    const wallets = [
        new PhantomWalletAdapter(),
    ]
    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <ReactUIWalletModalProvider>
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss={false}
                        draggable
                        pauseOnHover
                        theme="colored"
                    />
                    {children}
                </ReactUIWalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

export default SolanaWalletProvider