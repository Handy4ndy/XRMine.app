let xumm;

fetch("/api/key")
  .then((response) => response.json())
  .then((data) => {
    const XUMM_API_KEY = data.apiKey;

    xumm = new Xumm(XUMM_API_KEY);

    xumm.on("ready", () => console.log("Ready - Awaiting user sign in"));

    // User Login
    const loginButton = document.getElementById("signinbutton");

    loginButton.addEventListener("click", function () {
      xumm.authorize();
    });

    // Burn Transaction
    xumm.on("success", async () => {
      console.log("Sign in completed, initiating burn transaction");
      initiatePaymentAndSubscribe(xumm);
    });

    // User Logout
    xumm.on("logout", async () => {});
  
})
.catch((error) => console.error("Error fetching API key:", error));

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
      

