"use client";
import dynamic from 'next/dynamic';
import { JSG_MINT_ADDRESS, program } from "@/anchor/setup";
import * as anchor from "@coral-xyz/anchor";
import { useWalletMultiButton } from "@solana/wallet-adapter-base-ui";
// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);
import { useMemo, useState } from "react";
import { getOrCreateAssociatedTokenAccount, processTxInToast } from "@/utils";
import { promiseToast, showToast } from "@/utils/toast";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";


export default function Home() {
  const { publicKey, buttonState } = useWalletMultiButton({ onSelectWallet() { }, });
  const { sendTransaction } = useWallet();
  const [recipientAddress, setRecipientAddress] = useState("")
  const [amount, setAmount] = useState(0)
  const LABELS = {
    'change-wallet': 'Change wallet',
    connecting: 'Connecting ...',
    'copy-address': 'Copy address',
    copied: 'Copied',
    disconnect: 'Disconnect',
    'has-wallet': 'Connect',
    'no-wallet': 'Select Wallet',
  } as const;
  const content = useMemo(() => {
    if (publicKey) {
      const base58 = publicKey.toBase58();
      return base58.slice(0, 3) + '..' + base58.slice(-3);
    } else if (buttonState === 'connecting' || buttonState === 'has-wallet') {
      return LABELS[buttonState];
    } else {
      return LABELS['no-wallet'];
    }
  }, [buttonState, publicKey]);
  const transferToken = async () => {
    if (!publicKey) {
      showToast("Connect wallet", "warn")
      return
    }
    if (recipientAddress.trim() === "") {
      showToast("Input correct address", "error")
      return
    }
    if (amount <= 0) {
      showToast("Input correct amount", "warn")
      return
    }
    const fromAta = await getOrCreateAssociatedTokenAccount(publicKey, new PublicKey(publicKey), new PublicKey(JSG_MINT_ADDRESS), sendTransaction)
    const toAta = await getOrCreateAssociatedTokenAccount(publicKey, new PublicKey(recipientAddress), new PublicKey(JSG_MINT_ADDRESS), sendTransaction)
    promiseToast(new Promise(async (resolve, reject) => {
      const tx = await program.methods.transferToken(new anchor.BN(`${amount * 1000000}`)).accounts({
        from: publicKey,
        fromAta,
        toAta,
      }).transaction()
      await processTxInToast(tx, sendTransaction, resolve, reject)
    }), {
      pending: `Opening wallet...`,
      error: "Your operation failed."
    })

  }
  return (
    <div className="flex flex-col justify-center items-center p-10 gap-8 font-[family-name:var(--font-geist-sans)]">
      <WalletMultiButton style={{ backgroundImage: "linear-gradient(rgb(38, 210, 160), rgb(2, 126, 90))" }} endIcon={
        publicKey ? <img className="rounded-full" src={`https://i.pravatar.cc/150?u=${publicKey}`} alt="Logo" /> : undefined
      }>
        {content}
      </WalletMultiButton>
      <div className="w-full max-w-2xl flex flex-col justify-center items-center gap-6">
        <div className="w-full flex items-center gap-2">
          <input onChange={e => setRecipientAddress(e.target.value)} value={recipientAddress} placeholder="Enter Address" className="w-full bg-[#010101] border border-[#1B1B1D] p-4 rounded-xl" />
          <input onChange={e => setAmount(Number(e.target.value))} value={amount} type="number" placeholder="Enter Amount" className="w-full bg-[#010101] border border-[#1B1B1D] p-4 rounded-xl" />
        </div>
        <button onClick={transferToken} className="bg-blue-500 p-2 rounded-md hover:opacity-50 transition-all ease-in-out">Transfer Token</button>
      </div>
    </div>
  );
}
