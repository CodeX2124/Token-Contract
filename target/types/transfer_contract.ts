/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/transfer_contract.json`.
 */
export type TransferContract = {
  "address": "4dgAF5jMWvTsYjsN5BudREmFd3hysCqGEY56X5uamBKT",
  "metadata": {
    "name": "transferContract",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [],
      "args": []
    },
    {
      "name": "sendToken",
      "discriminator": [
        157,
        183,
        177,
        53,
        196,
        251,
        54,
        185
      ],
      "accounts": [
        {
          "name": "from",
          "writable": true
        },
        {
          "name": "recipient"
        },
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "mint",
          "address": "6khiMdkuBCVWpP4niKjK2Js5m7mNUwCGeQvQVkb32hDM"
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ]
};
