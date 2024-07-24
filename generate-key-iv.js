import crypto from 'crypto';

// Generate a 32-byte key (256 bits) for AES-256-CBC
const key = crypto.randomBytes(32).toString('hex');
console.log('Generated Key:', key);

// Generate a 16-byte IV (128 bits) for AES
const iv = crypto.randomBytes(16).toString('hex');
console.log('Generated IV:', iv);