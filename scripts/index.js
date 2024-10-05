const algorithm = 'AES-256-CBC';
const key = CryptoJS.enc.Hex.parse('94b57349db468e70d0daa2ca86a5513fc31984af810e75003d92ffb81f36f638');
const fallbackIv = CryptoJS.enc.Hex.parse('9661f6b347aec504c70fd5256d80e364'); // Fallback IV, use only if server doesn't provide one

function decrypt(encryptedText, ivHex) {
  try {
    const iv = ivHex ? CryptoJS.enc.Hex.parse(ivHex) : fallbackIv;
    const ciphertext = CryptoJS.enc.Hex.parse(encryptedText);
    const encrypted = CryptoJS.lib.CipherParams.create({
      ciphertext: ciphertext
    });
    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    console.log('Decrypted Text:', decryptedText); // Debugging line
    return decryptedText;
  } catch (error) {
    console.error('Decryption Error:', error);
    return null;
  }
}

fetch("/api/key")
  .then(response => response.json())
  .then(data => {
    console.log('Encrypted API Key:', data.apiKey); // Debugging line
    console.log('IV:', data.iv); // Debugging line
    const decryptedApiKey = decrypt(data.apiKey, data.iv);
    if (decryptedApiKey) {
      // Initialize xumm with the decrypted API key
      const xumm = new Xumm(decryptedApiKey);
      xumm.on("ready", () => console.log("Ready - Awaiting user sign in"));

    // User Login
    const loginButton = document.getElementById("signinbutton");
    loginButton.addEventListener("click", () => xumm.authorize());

    // Sign in success
    xumm.on("success", async () => {
      console.log("Sign in completed, initiating burn transaction");
      initiatePaymentAndSubscribe(xumm);
    });

    // User Logout
    xumm.on("logout", async () => {
      xumm.logout();
      console.log("User logged out, Returning to home page");
      window.location.href = "index.html";
    });
  
  } else {
    console.error('Failed to decrypt API key');
  }
})
.catch(error => {
  console.error('Fetch Error:', error);
});



// Burn Transaction
function initiatePaymentAndSubscribe(xumm) {
  xumm.payload
    .createAndSubscribe(
      {
        TransactionType: "Payment",
        Destination: "rfXMq3BMX2dTzJtG4pnhr49u6sHkVQXpWL",
        Amount: {
          currency: "58524D696E650000000000000000000000000000",
          value: "0.5",
          issuer: "rfXMq3BMX2dTzJtG4pnhr49u6sHkVQXpWL",
        },
        Fee: "12",
        Flags: "2147483648",

      },
      (eventMessage) => {
        if (Object.keys(eventMessage.data).indexOf("opened") > -1) {
          console.log("Payload opened in Xaman");
        }
        if (Object.keys(eventMessage.data).indexOf("signed") > -1) {
          document.getElementById("qrCodeModal").style.display = "none";
          return eventMessage;
        }
      }
    )
    .then(({ created, resolved }) => {
      console.log("Payload URL:", created.next.always);
      console.log("Payload QR:", created.refs.qr_png);

      document.getElementById("qrCodeImage").src = created.refs.qr_png;
      document.getElementById("qrCodeModal").style.display = "block";

      let payloadId = created.next.always.split("/").pop();

      let deepLink = generateDeepLink(payloadId);

      console.log("Deep Link URL:", deepLink);

      document.getElementById("deepLinkAnchor").href = deepLink;

      return resolved;
    })
    .then((payload) => {
      console.log("Payload resolved", payload);

      if (payload.data && payload.data.signed) {
        window.location.href = "trustset.html";

      } else {
        console.log("Payload rejected. Returning to home page");
        xumm.logout();
        window.location.href = "index.html";
      }
    })
    .catch((error) => {
      console.error("Error creating/payment payload:", error);
    });

  function generateDeepLink(payloadId) {
    // Construct the deep link URL
    const deepLinkBaseUrl = "xumm://payload/";
    return deepLinkBaseUrl + payloadId;
  }
}

function closeQRCodeModal() {
    document.getElementById("qrCodeModal").style.display = "none";
    alert("Burn transaction canceled, Decline the request in Xaman before continuing");
    console.log("Burn transaction incomplete, User logged out");
    xumm.logout();
    window.location.href = "index.html";
    }
      

