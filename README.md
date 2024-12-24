This demonstrates sending a solana transaction to a REST API

It needs to add a check for the signature, put the siganture in the header of the API call

A REST API server should check the header and see if a signature is there to prove a transfer was made

There would need to be a mechanism needed to check that the signature originated from that particular wallet and it is unique to avoid spam

The magic is that it works quickly by sending a transaction in the header of the API request to prove that SOL was sent to pay for the API

Transactions are calculated very quickly so this allows rapid proof that SOL was sent

The API checks the header, sees if there is a valid transaction proving SOL was sent

IF it was, then it hits the runwayML aPI

Needs a .env file to be added:

RUNWAYML_API_SECRET=
API_WALLET=
SOLANA_RPC_URL=https://api.devnet.solana.com
SENDER_WALLET=
SENDER_WALLET_PRIVATE_KEY=
TARGET_IMG_URL=

To run it just do npm install & node server.js

You need a RunwayML API key
