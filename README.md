# Blockchain Simulation

A JavaScript implementation of a simple blockchain that shows how blockchain technology works. I built this as a learning project to understand blocks, transactions, mining, and chain validation.

## What it does

This project creates a basic blockchain that:
- Creates blocks with transactions
- Uses SHA-256 for secure hashing
- Implements proof-of-work mining (finding hashes with leading zeros)
- Validates the blockchain to detect tampering
- Tracks balances for different addresses

## Setup

You'll need Node.js installed on your computer.

Just clone this repo:
```
git clone https://github.com/yourusername/JavaScript-Blockchain-.git
cd JavaScript-Blockchain-
```

No need to install any packages - it only uses Node's built-in crypto module.

## Running it

To run the simulation:
```
node blockchain.js
```

The program will:
1. Create a new blockchain
2. Add some test transactions
3. Mine a couple of blocks
4. Show the current state
5. Try to tamper with a transaction
6. Show how validation catches the tampering

## How I built it

### The Block Structure
Each block contains:
- Block number (index)
- When it was created (timestamp)
- List of transactions
- Hash of the previous block (for linking)
- Its own hash
- Nonce value (for mining)

### Transactions
Simple transfers with:
- Who sent it
- Who receives it
- How much was sent
- When it was sent

### Mining
Mining works by trying different nonce values until we find a hash that starts with a certain number of zeros. The more zeros required, the harder it is to find a valid hash. This is basically how proof-of-work functions in real cryptocurrencies.

### Chain Validation
The blockchain checks if it's valid by:
- Making sure each block's hash is correct
- Verifying each block points to the previous block correctly

If someone tries to change transaction data, the hashes won't match anymore and the validation will fail.

## Sample Output

```
Initializing blockchain...
Adding initial transactions...
Mining first block...
Mining block 1...
Block 1 mined! Hash: 0000f87453...
Adding more transactions...
Mining second block...
Mining block 2...
Block 2 mined! Hash: 0000ae3211...

Blockchain data:
[
  {
    "index": 0,
    "timestamp": "4/9/2025, 7:30:00 PM",
    "transactions": [],
    "previousHash": "0",
    "hash": "8a7b365ec...",
    "nonce": 0
  },
  {
    "index": 1,
    "timestamp": "4/9/2025, 7:30:01 PM",
    "transactions": [
      {
        "sender": "Alice",
        "recipient": "Bob",
        "amount": 50,
        "timestamp": 1712697001234
      },
      {
        "sender": "Bob",
        "recipient": "Charlie",
        "amount": 25,
        "timestamp": 1712697001235
      }
    ],
    "previousHash": "8a7b365ec...",
    "hash": "0000f87453...",
    "nonce": 45231
  },
  {
    "index": 2,
    "timestamp": "4/9/2025, 7:30:05 PM",
    "transactions": [
      {
        "sender": null,
        "recipient": "MinerX",
        "amount": 100,
        "timestamp": 1712697005678
      },
      {
        "sender": "Charlie",
        "recipient": "Alice",
        "amount": 10,
        "timestamp": 1712697005679
      },
      {
        "sender": "Alice",
        "recipient": "MinerX",
        "amount": 15,
        "timestamp": 1712697005680
      }
    ],
    "previousHash": "0000f87453...",
    "hash": "0000ae3211...",
    "nonce": 62754
  }
]

MinerX balance: 115
Blockchain valid: true

Attempting to tamper with transaction data...
Block 1 data corrupted - hash mismatch
Blockchain valid after tampering: false
```

## Future improvements

If I continue working on this, I might:
- Add a simple API so you can interact with it through HTTP
- Create a basic wallet system with keys
- Simulate a peer-to-peer network
- Try implementing smart contracts
- Make the mining difficulty adjust automatically

Feel free to fork this and experiment on your own!
