import { Program } from "@coral-xyz/anchor";
import { IDL, NewToken } from "./idl";
import { Connection } from "@solana/web3.js";
export const JSG_MINT_ADDRESS = "jsgn8DFJuZf9PA2fTovzub5NvPPk9zS9vWgVEx3287w"
export const endpoint = "https://api.devnet.solana.com"
export const connection = new Connection(endpoint, "confirmed");
export const program = new Program<NewToken>(IDL, {
  connection
});
