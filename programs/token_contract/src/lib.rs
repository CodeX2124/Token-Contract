use anchor_lang::prelude::*;
use anchor_spl::token_2022::{self, TransferChecked};
use anchor_spl::token_interface::{Mint, Token2022, TokenAccount};
use std::str::FromStr;

declare_id!("4dgAF5jMWvTsYjsN5BudREmFd3hysCqGEY56X5uamBKT");
pub const MINT_ADDRESS: &str = "6khiMdkuBCVWpP4niKjK2Js5m7mNUwCGeQvQVkb32hDM";
#[program]
pub mod transfer_contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Initialized: {:?}", ctx.program_id);
        Ok(())
    }
    pub fn send_token(ctx: Context<SendToken>, amount: u64) -> Result<()> {
        let from_account = ctx.accounts.from.clone().to_account_info();
        let token_program = ctx.accounts.token_program.clone().to_account_info();
        let authority_info = ctx.accounts.authority.clone().to_account_info();
        let to_account = ctx.accounts.recipient.clone().to_account_info();
        let mint = ctx.accounts.mint.clone().to_account_info();

        let transfer_cpi_accounts = TransferChecked {
            from: from_account,
            to: to_account,
            authority: authority_info,
            mint: mint,
        };

        //Create a context for the transfer and execute the transfer_checked instruction.
        let cpi_ctx = CpiContext::new(token_program, transfer_cpi_accounts);
        token_2022::transfer_checked(cpi_ctx, amount, ctx.accounts.mint.decimals)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct SendToken<'info> {
    #[account(mut)]
    pub from: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub recipient: Box<InterfaceAccount<'info, TokenAccount>>,
    pub authority: Signer<'info>,
    #[account(address=Pubkey::from_str(MINT_ADDRESS).unwrap())]
    pub mint: Box<InterfaceAccount<'info, Mint>>, // Source associated token account
    pub token_program: Program<'info, Token2022>,
}    

#[derive(Accounts)]
pub struct Initialize {}
