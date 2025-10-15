# MongoDB Setup Guide

## Installation

### macOS (using Homebrew)
```bash
# Install MongoDB Community Edition
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify installation
mongod --version
mongo --version
```

### Windows
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the prompts
3. Add MongoDB's `bin` directory to your system's PATH
4. Create a data directory: `C:\data\db`
5. Start MongoDB: `mongod`

### Linux (Ubuntu/Debian)
```bash
# Import the public key
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

# Reload local package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod

# Enable automatic startup
sudo systemctl enable mongod
```

## MongoDB Compass (GUI Tool)
Download and install MongoDB Compass from: https://www.mongodb.com/try/download/compass

## Basic Commands

### Start MongoDB Shell
```bash
mongosh  # For MongoDB 6.0+
# or
mongo    # For older versions
```

### Show Databases
```javascript
show dbs
```

### Switch/Create Database
```javascript
use mydb
```

### Show Collections
```javascript
show collections
```

### Get Help
```javascript
db.help()
```

## Connecting with Node.js

### Install MongoDB Driver
```bash
npm install mongodb
```

### Basic Connection
```javascript
const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb://localhost:27017';

// Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log('Connected successfully to MongoDB');
    
    // Get the database
    const db = client.db('mydb');
    
    // Get the collection
    const collection = db.collection('documents');
    
    // Insert a document
    await collection.insertOne({ name: 'Test', value: 1 });
    
    // Find documents
    const docs = await collection.find({}).toArray();
    console.log('Found documents:', docs);
    
  } finally {
    // Close the connection
    await client.close();
  }
}

run().catch(console.dir);
```

## Configuration

### MongoDB Configuration File (mongod.conf)
Typical location:
- Linux: `/etc/mongod.conf`
- macOS: `/usr/local/etc/mongod.conf`
- Windows: `C:\Program Files\MongoDB\Server\<version>\bin\mongod.cfg`

### Common Configuration Options
```yaml
# Network interfaces
net:
  port: 27017
  bindIp: 127.0.0.1  # Only localhost
  
# Storage
dbPath: /data/db

# Security
security:
  authorization: enabled  # Enable authentication

# Replication (for replica sets)
replication:
  replSetName: "rs0"

# Performance
storage:
  journal:
    enabled: true
  wiredTiger:
    engineConfig:
      cacheSizeGB: 1  # Adjust based on available RAM
```

## Authentication

### Create Admin User
```javascript
use admin
db.createUser({
  user: 'admin',
  pwd: 'your-secure-password',
  roles: [ { role: 'userAdminAnyDatabase', db: 'admin' } ]
})
```

### Connect with Authentication
```javascript
const uri = 'mongodb://admin:your-secure-password@localhost:27017/admin';
const client = new MongoClient(uri);
```

## Backup and Restore

### Create Backup
```bash
mongodump --uri="mongodb://localhost:27017" --out=/backup/$(date +%Y%m%d)
```

### Restore from Backup
```bash
mongorestore --uri="mongodb://localhost:27017" /backup/20231015/mydb
```

## Monitoring

### Basic Stats
```javascript
db.serverStatus()

db.stats()

// Collection stats
db.collection.stats()

// Current operations
db.currentOp()
```

### Enable Profiling
```javascript
// Set profiling level (0=off, 1=slow, 2=all)
db.setProfilingLevel(1, { slowms: 100 })

// View profile data
db.system.profile.find().pretty()
```
