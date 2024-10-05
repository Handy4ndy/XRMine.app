// import express from 'express';
// import { fileURLToPath } from 'url';
// import path from 'path';
// import dotenv from 'dotenv';
// import crypto from 'crypto'; // Import the crypto module for decryption
// import fs from 'fs';
// import initializeXumm from './xaman.js';
// import { Xumm } from 'xumm';
// import xumm from 'xumm';

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// // Specify the directory where static files are located
// const publicDirectoryPath = path.join(__dirname, 'public');

// // Specify the directory where JavaScript files are located
// const scriptsDirectoryPath = path.join(__dirname, 'scripts');

// // Configure Express to serve static files
// app.use(express.static(publicDirectoryPath));

// // Define route to serve the decrypted XUMM API key
// app.get('/api/key', (req, res) => {
//     const apiKey = process.env.XUMM_APIKEY;
//     res.json({ apiKey });
// });

// app.get('/seed/phrase', (req, res) => {
//     const seedPhrase = process.env.SEED_PHRASE;
//     res.json({ seedPhrase });
// });

// app.get('/index.js', (req, res) => {
//     res.sendFile(path.join(scriptsDirectoryPath, 'index.js'));
// });


// // Serve the home page (index.html) from the public directory
// app.get('/', (req, res) => {
//     res.sendFile(path.join(publicDirectoryPath, 'index.html'));
// });

// app.get('/app.js', (req, res) => {
//     res.sendFile(path.join(scriptsDirectoryPath, 'app.js'));
// });

// app.get('/checkTrustlines.js', (req, res) => {
//     res.sendFile(path.join(scriptsDirectoryPath, 'checkTrustlines.js'));
// });

// app.get('/xrpl-latest-min.js', (req, res) => {
//     res.sendFile(path.join(scriptsDirectoryPath, 'xrpl-latest-min.js'));
// });

// app.use(['/xspectar.js', '/treasury.js', '/nftempo.js'], (req, res, next) => {
//     req.xumm = xumm; // Pass the xumm object to the request object
//     next(); // Move to the next middleware or route handler
// });

// app.get('/xspectar.js', (req, res) => {
//     res.sendFile(path.join(scriptsDirectoryPath, 'xspectar.js'));
// });

// app.get('/treasury.js', (req, res) => {
//     res.sendFile(path.join(scriptsDirectoryPath, 'treasury.js'));
// });

// app.get('/nftempo.js', (req, res) => {
//     res.sendFile(path.join(scriptsDirectoryPath, 'nftempo.js'));
// });

// // Serve the trustline page from the public directory
// app.get('/trustset', (req, res) => {
//     res.sendFile(path.join(publicDirectoryPath, 'trustset.html'));
// });

// // Serve the mining page from the public directory
// app.get('/xrmine', (req, res) => {
//     res.sendFile(path.join(publicDirectoryPath, 'xrmine.html'));
// });

// app.get('/mine.js', (req, res) => {
//     res.sendFile(path.join(scriptsDirectoryPath, 'mine.js'));
// });

// app.get('/tbXrmine.js', (req, res) => {
//     res.sendFile(path.join(scriptsDirectoryPath, 'tbXrmine.js'));
// });

// app.get('/stXrmine.js', (req, res) => {
//     res.sendFile(path.join(scriptsDirectoryPath, 'stXrmine.js'));
// });

// //let apiKey = process.env.XUMM_APIKEY;
// //xumm = initializeXumm(apiKey);


// // Start the server after Xumm is initialized
//     const PORT = process.env.PORT || 5500;
//     app.listen(PORT, () => {
//         console.log(`Server is running on http://127.0.0.1:${PORT}`);
//     });

import express from 'express';
import { fileURLToPath } from 'url';
import { Wallet } from 'xrpl';
import path from 'path';
import dotenv from 'dotenv';
import crypto from 'crypto';
import fs from 'fs';
import https from 'https';
import { XummSdk } from 'xumm-sdk';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// SSL Certificate
const privateKey = fs.readFileSync(path.join(__dirname, 'certs', 'localhost.key'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'certs', 'localhost.crt'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Initialize Xumm SDK
const apiKey = process.env.XUMM_APIKEY;
const apiSecret = process.env.XUMM_APISECRET;
const xumm = new XummSdk(apiKey, apiSecret);

xumm.ping().then((response) => {
    console.log('Xumm SDK initialized:', response.application.name);
}).catch((error) => {
    console.error('Error initializing Xumm SDK:', error);
    process.exit(1);
});

// Specify the directory where static files are located
const publicDirectoryPath = path.join(__dirname, 'public');

// Specify the directory where JavaScript files are located
const scriptsDirectoryPath = path.join(__dirname, 'scripts');

// Configure Express to serve static files
app.use(express.static(publicDirectoryPath));

// // Define route to serve the decrypted XUMM API key
// app.get('/api/key', (req, res) => {
//     const apiKey = process.env.XUMM_APIKEY;
//     res.json({ apiKey });
// });

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // 32 bytes key
const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex'); // 16 bytes IV

function encrypt(text) {
  let cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

app.get('/api/key', (req, res) => {
    const apiKey = process.env.XUMM_APIKEY;
    const iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(apiKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    res.json({ apiKey: encrypted, iv: iv.toString('hex') });
  });

app.get('/seed/phrase', (req, res) => {
    const seedPhrase = process.env.SEED_PHRASE;
    res.json({ seedPhrase });
});

app.get('/index.js', (req, res) => {
    res.sendFile(path.join(scriptsDirectoryPath, 'index.js'));
});

// Serve the home page (index.html) from the public directory
app.get('/', (req, res) => {
    res.sendFile(path.join(publicDirectoryPath, 'index.html'));
});

app.get('/app.js', (req, res) => {
    res.sendFile(path.join(scriptsDirectoryPath, 'app.js'));
});

app.get('/checkTrustlines.js', (req, res) => {
    res.sendFile(path.join(scriptsDirectoryPath, 'checkTrustlines.js'));
});

app.get('/xrpl-latest-min.js', (req, res) => {
    res.sendFile(path.join(scriptsDirectoryPath, 'xrpl-latest-min.js'));
});

app.use(['/xspectar.js', '/treasury.js', '/nftempo.js'], (req, res, next) => {
    //req.xumm = xumm; // Pass the xumm object to the request object
    next(); // Move to the next middleware or route handler
});

app.get('/xspectar.js', (req, res) => {
    res.sendFile(path.join(scriptsDirectoryPath, 'xspectar.js'));
});

app.get('/treasury.js', (req, res) => {
    res.sendFile(path.join(scriptsDirectoryPath, 'treasury.js'));
});

app.get('/nftempo.js', (req, res) => {
    res.sendFile(path.join(scriptsDirectoryPath, 'nftempo.js'));
});

// Serve the trustline page from the public directory
app.get('/trustset', (req, res) => {
    res.sendFile(path.join(publicDirectoryPath, 'trustset.html'));
});

// Serve the mining page from the public directory
app.get('/xrmine', (req, res) => {
    res.sendFile(path.join(publicDirectoryPath, 'xrmine.html'));
});

app.get('/mine.js', (req, res) => {
    res.sendFile(path.join(scriptsDirectoryPath, 'mine.js'));
});

app.get('/tbXrmine.js', (req, res) => {
    res.sendFile(path.join(scriptsDirectoryPath, 'tbXrmine.js'));
});

app.get('/stXrmine.js', (req, res) => {
    res.sendFile(path.join(scriptsDirectoryPath, 'stXrmine.js'));
});

<<<<<<< Updated upstream
// Start the server with HTTPS
const PORT = process.env.PORT || 5500;
https.createServer(credentials, app).listen(PORT, () => {
    console.log(`Server is running on https://127.0.0.1:${PORT}`);
});
=======
//let apiKey = process.env.XUMM_APIKEY;
//xumm = initializeXumm(apiKey);


/// SERVER NEW!!!!!




// Start the server after Xumm is initialized
    const PORT = process.env.PORT || 5500;
    app.listen(PORT, () => {
        console.log(`Server is running on http://127.0.0.1:${PORT}`);
    });

>>>>>>> Stashed changes
