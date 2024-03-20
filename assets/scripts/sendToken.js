// Retrieve lastTransactionTimestamp from local storage, if available
let lastTransactionTimestamp = localStorage.getItem("lastTransactionTimestamp");

async function sendTokens() {
  try {
    const client = new xrpl.Client("wss://xrplcluster.com");
    await client.connect();

    // Check if 24 hours have elapsed since the last transaction
    if (lastTransactionTimestamp) {
      const now = new Date();
      const elapsedHours = (now - new Date(lastTransactionTimestamp)) / (1000 * 60 * 60); // Convert milliseconds to hours
      if (elapsedHours < 24) {
          console.log("Cannot execute transaction. 24-hour lock is active.");
          return;
      }
    }

    const connectedWallet = document.getElementById("accountaddress").innerText;
    const standbyWallet = xrpl.Wallet.fromSeed('DROP_XRMINE');

    const sendTokenTx = {
      "TransactionType": "Payment",
      "Account": 'rPBYqXye7rJFQ9HzwfYYW88SbuKv5P9cHK',
      "Amount": {
        "currency": '58524D696E650000000000000000000000000000', // XRmine currency code
        "value": '0.5', // Sending 5 XRmine tokens
        "issuer": 'rfXMq3BMX2dTzJtG4pnhr49u6sHkVQXpWL' // XRmine issuer address
      },
      "Destination": connectedWallet
    };
      
    const payPrepared = await client.autofill(sendTokenTx);
    const paySigned = standbyWallet.sign(payPrepared);

    console.log("Sending 5 XRmine tokens to:", connectedWallet);

    const payResult = await client.submitAndWait(paySigned.tx_blob);

    if (payResult.result.meta.TransactionResult == "tesSUCCESS") {
      console.log("Transaction succeeded");
    } else {
      throw "Error sending transaction";
    }

    // Update lastTransactionTimestamp in local storage
    lastTransactionTimestamp = new Date().toISOString();
    localStorage.setItem("lastTransactionTimestamp", lastTransactionTimestamp);

    client.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
}
