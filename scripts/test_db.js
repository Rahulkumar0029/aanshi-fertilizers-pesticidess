const mongoose = require('mongoose');
const fs = require('fs');

// Simple env loader
const content = fs.readFileSync('.env.local', 'utf-8');
const env = {};
content.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
});

const uri = env.MONGODB_URI;
if (!uri) {
    console.error('MONGODB_URI not found');
    process.exit(1);
}

// Masking password for safety
const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '// $1:****@');
console.log('Connecting to:', maskedUri);

mongoose.connect(uri)
    .then(() => console.log('Connected ✅'))
    .catch(err => {
        console.error('Error ❌:', err.message);
        process.exit(1);
    });
