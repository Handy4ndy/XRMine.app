import forge from 'node-forge';
import fs from 'fs';

// Create a new key pair
const pki = forge.pki;
const keys = pki.rsa.generateKeyPair(2048);
const cert = pki.createCertificate();
cert.publicKey = keys.publicKey;
cert.serialNumber = '01';
cert.validFrom = new Date().toISOString();
cert.validTo = new Date();
cert.validTo.setFullYear(cert.validTo.getFullYear() + 1);

// Set the certificate issuer and subject (self-signed)
cert.setSubject([{
  name: 'commonName',
  value: 'localhost'
}]);
cert.setIssuer([{
  name: 'commonName',
  value: 'localhost'
}]);

// Sign the certificate with the private key
cert.sign(keys.privateKey);

// Convert to PEM format
const privateKeyPem = pki.privateKeyToPem(keys.privateKey);
const certificatePem = pki.certificateToPem(cert);

// Save the key and certificate to files
fs.writeFileSync('localhost.key', privateKeyPem);
fs.writeFileSync('localhost.crt', certificatePem);

console.log('Certificate and key generated');
