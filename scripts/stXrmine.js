async function sendTokens() {
  try {
    const client = new xrpl.Client("wss://xrplcluster.com");
    await client.connect();

    const connectedWallet = document.getElementById("accountaddress").innerText;

    // Fetch the SEED phrase from the server
    const seedResponse = await fetch("/seed/phrase");
    const seedData = await seedResponse.json();
    const SEED = seedData.seedPhrase;

    // Create a standby wallet using the fetched SEED phrase
    const standbyWallet = xrpl.Wallet.fromSeed(SEED);

    const sendTokenTx = {
      "TransactionType": "Payment",
      "Account": 'rPBYqXye7rJFQ9HzwfYYW88SbuKv5P9cHK',
      "Amount": {
        "currency": '58524D696E650000000000000000000000000000', // XRmine currency code
        "value": '0.05', // Sending 0.05 XRmine tokens
        "issuer": 'rfXMq3BMX2dTzJtG4pnhr49u6sHkVQXpWL' // XRmine issuer address
      },
      "Destination": connectedWallet
    };
      
    const payPrepared = await client.autofill(sendTokenTx);
    const paySigned = standbyWallet.sign(payPrepared);

    console.log("Sending 0.05 XRmine tokens to:", connectedWallet);

    const payResult = await client.submitAndWait(paySigned.tx_blob);

    if (payResult.result.meta.TransactionResult == "tesSUCCESS") {
      console.log("Transaction succeeded");
    } else {
      throw "Error sending transaction";
    }

    client.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
}
