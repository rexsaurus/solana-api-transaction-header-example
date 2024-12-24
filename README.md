This demonstrates sending a solana transaction to a REST API

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
