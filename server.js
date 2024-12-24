require('dotenv').config(); // Load .env file
const express = require('express');
const bodyParser = require('body-parser');
const { Connection, PublicKey, Transaction, SystemProgram, Keypair } = require('@solana/web3.js');
const RunwayML = require('@runwayml/sdk');

const client = new RunwayML(); // Initialize the RunwayML client

// Load environment variables
const connection = new Connection(process.env.SOLANA_RPC_URL, 'confirmed');
const API_WALLET = process.env.API_WALLET;
const RUNWAY_API_KEY = process.env.RUNWAY_API_KEY;
const SENDER_WALLET_PRIVATE_KEY = JSON.parse(process.env.SENDER_WALLET_PRIVATE_KEY);
const TARGET_IMG_URL = process.env.TARGET_IMG_URL;
const SENDER_WALLET = Keypair.fromSecretKey(Uint8Array.from(SENDER_WALLET_PRIVATE_KEY));
const PORT = 3000;

// Middleware for Express
const app = express();
app.use(bodyParser.json());

// Function: Send 1/100th of a SOL
async function sendSol(recipient, amount) {
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: SENDER_WALLET.publicKey,
            toPubkey: recipient,
            lamports: amount, // Amount in lamports
        })
    );

    // Sign and send the transaction
    const signature = await connection.sendTransaction(transaction, [SENDER_WALLET]);
    return signature;
}

// Function: Poll RunwayML Task
async function pollRunwayTask(taskId) {
    let task;

    console.log('Polling RunwayML task...');
    do {
        // Wait for 10 seconds before polling again
        await new Promise(resolve => setTimeout(resolve, 10000));

        // Retrieve the task status
        task = await client.tasks.retrieve(taskId);
        console.log(`Task Status: ${task.status}`);
    } while (!['SUCCEEDED', 'FAILED'].includes(task.status));

    return task;
}

// CLI: Request Movie Generation
async function requestMovieCLI() {
    console.log("Starting the process...");

    const recipient = new PublicKey(API_WALLET);
    const amount = 0.01 * 1e9; // 1/100th of a SOL in lamports (10,000,000 lamports)

    try {
        console.log("Sending 1/100th of a SOL as payment...");
        const signature = await sendSol(recipient, amount);

        console.log(`Payment sent successfully. Transaction Signature: ${signature}`);
        console.log("Starting image-to-video task on RunwayML...");

        // Create a new image-to-video task
        const imageToVideo = await client.imageToVideo.create({
            model: 'gen3a_turbo', // Example model
            promptImage: TARGET_IMG_URL, // Use the placeholder image URL from .env
            promptText: 'This is an example video generation prompt.', // Example prompt
        });

        const taskId = imageToVideo.id;
        console.log(`RunwayML Task Created. Task ID: ${taskId}`);

        // Poll the task until it's complete
        const task = await pollRunwayTask(taskId);

        console.log('Task complete:', task);

        if (task.status === 'SUCCEEDED') {
            console.log('Video Generation Successful!');
            console.log('Generated Video URL:', task.result);
        } else {
            console.error('Task failed:', task);
        }
    } catch (error) {
        console.error('Error during movie generation process:', error.response?.data || error.message);
    }
}

// Start Express Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    requestMovieCLI(); // Automatically trigger the CLI process on server start
});
