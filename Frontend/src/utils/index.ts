import * as anchor from "@coral-xyz/anchor";
import {
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress,
    TOKEN_2022_PROGRAM_ID
} from "@solana/spl-token";
import { connection } from "../anchor/setup";
import { Transaction } from "@solana/web3.js";
import { promiseToast } from "./toast";
export async function getOrCreateAssociatedTokenAccount(fromPubkey: anchor.web3.PublicKey, recipientPubkey: anchor.web3.PublicKey, mintPublicKey: anchor.web3.PublicKey, sendTransaction: (transaction: anchor.web3.Transaction | anchor.web3.VersionedTransaction, connection: anchor.web3.Connection, options?: any) => Promise<anchor.web3.TransactionSignature>
    , isToken2022: boolean = true) {
    const associatedAddress = await getAssociatedTokenAddress(
        mintPublicKey,
        recipientPubkey,
        false,
        isToken2022 ? TOKEN_2022_PROGRAM_ID : undefined
    );
    const accountInfo = await connection.getAccountInfo(associatedAddress);
    if (accountInfo) return associatedAddress
    const tx = new Transaction().add(
        createAssociatedTokenAccountInstruction(
            fromPubkey, // payer
            associatedAddress,
            recipientPubkey, // owner
            mintPublicKey,
            isToken2022 ? TOKEN_2022_PROGRAM_ID : undefined
        )
    );
    const signature = await sendTransaction(tx, connection, { commitment: "confirmed" });
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash({ commitment: "confirmed" });
    await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
    }, "confirmed");
    return associatedAddress;
}
export const processTxInToast = async (tx: anchor.web3.Transaction, sendTransaction: (transaction: anchor.web3.Transaction | anchor.web3.VersionedTransaction, connection: anchor.web3.Connection, options?: any) => Promise<anchor.web3.TransactionSignature>, resolve: (value: unknown) => void, reject: (reason?: any) => void) => {
    try {
        const signature = await sendTransaction(tx, connection)
        promiseToast(new Promise(async (res, rej) => {
            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash({ commitment: "confirmed" });
            const confirm_result = await connection.confirmTransaction({
                blockhash,
                lastValidBlockHeight,
                signature,
            }, "confirmed");
            if (confirm_result.value.err) {
                rej("Confirmation failed!")
            } else {
                res(true)
            }
        }), {
            pending: "Waiting for confirmation...",
            success: "Transaction succeed. Click here to view transaction.",
            error: "Transaction failed!"
        }, {
            onClick: () => window.open(`https://solscan.io/tx/${signature}?cluster=devnet`, "_blank")
        })
        resolve(null)
    } catch (error) {
        reject(null)
    }
}