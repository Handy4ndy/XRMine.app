/*import { Xumm } from 'xumm';
import xumm from 'xumm';

// Initialize Xumm with the API key
const initializeXumm = (apiKey) => {
   xumm = new Xumm(apiKey);

    // Event listener for when Xumm is ready
    xumm.on("ready", () => {
        console.log("Xumm is ready to process transactions.");
    });

    return xumm;
};

export default initializeXumm;*/



import Xumm from 'xumm'; // Import the Xumm library or module here
import express from 'express';


const router = express.Router();

router.get('/authorize', async (req, res) => {
    try {
        // Fetch the XUMM API key securely from environment variables or secure storage
        const apiKey = process.env.XUMM_APIKEY;

        // Initialize the Xumm object with the API key
        const xumm = new Xumm(apiKey);

        // Event listener for when Xumm is ready
        xumm.on("ready", () => {
            console.log("Ready - Awaiting user sign in");
            res.status(200).send("Ready for user sign in");
        });

        // Event listener for successful sign-in
        xumm.on("success", () => {
            console.log("Sign in completed, initiating burn transaction");
            res.status(200).send("Sign in completed, initiating burn transaction");
            initiatePaymentAndSubscribe(xumm);
        });

        // Event listener for user logout
        xumm.on("logout", () => {
            console.log("User logged out");
            res.status(200).send("User logged out");
        });

        // Authorize the user with Xumm
        xumm.authorize();
    } catch (error) {
        console.error("Error authorizing user:", error);
        res.status(500).send("Internal server error");
    }
});

// Function to initiate payment and subscribe
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

export default router;
