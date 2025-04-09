// Need crypto for SHA-256 hashing
const crypto = require('crypto');

/**
 * Represents a transaction between two parties
 */
class Transaction {
    constructor(sender, recipient, amount) {
        this.sender = sender;
        this.recipient = recipient;
        this.amount = amount;
        this.timestamp = Date.now();
    }
}

/**
 * Represents a block in the blockchain
 */
class Block {
    constructor(index, timestamp, transactions, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    /**
     * Generates SHA-256 hash based on block contents
     */
    calculateHash() {
        return crypto.createHash('sha256')
            .update(
                this.index.toString() + 
                this.timestamp.toString() + 
                JSON.stringify(this.transactions) + 
                this.previousHash + 
                this.nonce.toString()
            )
            .digest('hex');
    }

    /**
     * Mines block by finding hash with leading zeros
     * @param {number} difficulty - Number of leading zeros required
     */
    mineBlock(difficulty) {
        let targetPrefix = '0'.repeat(difficulty);
        
        console.log(`Mining block ${this.index}...`);
        while (this.hash.substring(0, difficulty) !== targetPrefix) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        
        console.log(`Block ${this.index} mined! Hash: ${this.hash}`);
    }
}

/**
 * Main blockchain implementation
 */
class Blockchain {
    constructor() {
        this.chain = [this._createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    /**
     * Creates the first block in the chain
     * @private
     */
    _createGenesisBlock() {
        return new Block(0, Date.now(), [], '0');
    }

    /**
     * Returns the most recently added block
     */
    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    /**
     * Adds a new transaction to the pending pool
     * @param {Transaction} tx - Transaction to add
     */
    addTransaction(tx) {
        // Validate transaction
        if (!tx.sender || !tx.recipient || tx.amount <= 0) {
            throw new Error('Invalid transaction: must have sender, recipient, and positive amount');
        }

        this.pendingTransactions.push(tx);
    }

    /**
     * Processes pending transactions into a new block
     * @param {string} minerAddress - Address to receive mining reward
     */
    minePendingTransactions(minerAddress) {
        // Create new block with all pending transactions
        let block = new Block(
            this.chain.length,
            Date.now(),
            this.pendingTransactions,
            this.getLastBlock().hash
        );

        // Find valid proof-of-work
        block.mineBlock(this.difficulty);

        // Add to chain
        this.chain.push(block);

        // Clear pending and add mining reward for next block
        this.pendingTransactions = [
            new Transaction(null, minerAddress, this.miningReward)
        ];
    }

    /**
     * Verifies the integrity of the entire blockchain
     */
    validateChain() {
        // Start from block 1 (after genesis block)
        for (let i = 1; i < this.chain.length; i++) {
            const current = this.chain[i];
            const previous = this.chain[i - 1];

            // Check if current block hash is valid
            if (current.hash !== current.calculateHash()) {
                console.log(`Block ${i} data corrupted - hash mismatch`);
                return false;
            }

            // Check link to previous block
            if (current.previousHash !== previous.hash) {
                console.log(`Block ${i} has broken chain link`);
                return false;
            }
        }

        return true;
    }

    /**
     * Calculates the balance for an address
     * @param {string} address - Address to check balance for
     */
    getBalance(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const tx of block.transactions) {
                if (tx.sender === address) {
                    balance -= tx.amount;
                }
                
                if (tx.recipient === address) {
                    balance += tx.amount;
                }
            }
        }

        return balance;
    }

    /**
     * Returns formatted representation of the chain
     */
    getFormatted() {
        return this.chain.map(block => ({
            index: block.index,
            timestamp: new Date(block.timestamp).toLocaleString(),
            transactions: block.transactions,
            previousHash: block.previousHash,
            hash: block.hash,
            nonce: block.nonce
        }));
    }
}

/**
 * Demo function
 */
function runDemo() {
    // Set up a new blockchain
    console.log("Initializing blockchain...");
    const coin = new Blockchain();
    
    // Add initial transactions
    console.log("Adding initial transactions...");
    coin.addTransaction(new Transaction('Alice', 'Bob', 50));
    coin.addTransaction(new Transaction('Bob', 'Charlie', 25));
    
    // Mine first block
    console.log("Mining first block...");
    coin.minePendingTransactions('MinerX');
    
    // Add more transactions
    console.log("Adding more transactions...");
    coin.addTransaction(new Transaction('Charlie', 'Alice', 10));
    coin.addTransaction(new Transaction('Alice', 'MinerX', 15));
    
    // Mine second block
    console.log("Mining second block...");
    coin.minePendingTransactions('MinerX');
    
    // Display chain
    console.log("\nBlockchain data:");
    console.log(JSON.stringify(coin.getFormatted(), null, 2));
    
    // Check balances and validity
    console.log(`\nMinerX balance: ${coin.getBalance('MinerX')}`);
    console.log(`Blockchain valid: ${coin.validateChain()}`);
    
    // Demonstrate tampering detection
    console.log("\nAttempting to tamper with transaction data...");
    coin.chain[1].transactions[0].amount = 100;
    
    console.log(`Blockchain valid after tampering: ${coin.validateChain()}`);
}

// Execute demo
runDemo();