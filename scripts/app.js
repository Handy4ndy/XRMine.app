// Define xumm globally
let xumm;

// Fetch API key
fetch("/api/key")
  .then((response) => response.json())
  .then((data) => {
    const XUMM_API_KEY = data.apiKey;

    // Initialize xummz
    xumm = new Xumm(XUMM_API_KEY);

    xumm.on("ready", () =>
      console.log("Ready to explore whitepapers and set trustlines")
    );

    xumm.user.account.then((account) => {
      console.log(account + " has been connected, Welcome to XRmine!!!!");
      document.getElementById("accountaddress").innerText = account;
      checkTrustlines(account);
    });

    xumm.on("logout", async () => {
      xumm.logout();
      console.log("User logged out, Returning to home page");
      window.location.href = "index.html";
    });

  });

  function closeQRCodeModal() {
    document.getElementById("qrCodeModal").style.display = "none";
    alert("Transaction has not been signed!, please check Xaman Events page");
    xumm.logout();
  }

  
  //-------------------------------------------------------------------------------------- xSpectar Trustline


  // Find the button element by its ID
  const trustSetXspectarButton = document.getElementById("trustSetXspectar");

  // Add an event listener to the button
  trustSetXspectarButton.addEventListener("click", function() {
      // Call the trustline setting function when the button is clicked
      setXspectarTrustline(xumm);
  });

  function setXspectarTrustline(xumm) {
    xumm.payload.createAndSubscribe({
      TransactionType: 'TrustSet',
      Fee: '12',
      Flags: '131072',
      LimitAmount: {
        currency: '7853504543544152000000000000000000000000',
        issuer: 'rh5jzTCdMRCVjQ7LT6zucjezC47KATkuvv',
        value: '88870977.6946372'
      },
    }, eventMessage => {
      if (Object.keys(eventMessage.data).indexOf('opened') > -1) {
        console.log("Payload sent to user");
      }
      if (Object.keys(eventMessage.data).indexOf('signed') > -1) {
        document.getElementById('qrCodeModal').style.display = 'none';
        return eventMessage;
      }
    })
    .then(({ created, resolved }) => {
      console.log('Payload URL:', created.next.always);
      console.log('Payload QR:', created.refs.qr_png);
  
      document.getElementById('qrCodeImage').src = created.refs.qr_png;
      document.getElementById('qrCodeModal').style.display = 'block';
  
      let payloadId = created.next.always.split('/').pop();
  
      let deepLink = generateDeepLink(payloadId); 
  
      console.log('Deep Link URL:', deepLink); 
  
      
      document.getElementById('deepLinkAnchor').href = deepLink;
  
      return resolved;
    })
    .then(payload => {
      console.log('Payload resolved', payload);
        
      if (payload.data.signed) {
        window.location.href = "trustset.html";
      } else {
        console.log('Payload rejected');
        alert("Payload rejected. Please try again");
      }
    })
    .catch(error => {
      console.error("Error creating/payment payload:", error);
    });

    function generateDeepLink(payloadId) {
      const deepLinkBaseUrl = 'xumm://payload/';
      return deepLinkBaseUrl + payloadId;
    }
  }
  //-------------------------------------------------------------------------------------- treasury trustline

  // Find the button element by its ID
  const trustSetTreasuryButton = document.getElementById("trustSetTreasury");

  // Add an event listener to the button
  trustSetTreasuryButton.addEventListener("click", function() {
      // Call the trustline setting function when the button is clicked
      setTreasuryTrustline(xumm);
  });

  function setTreasuryTrustline(xumm) {

    xumm.payload.createAndSubscribe({
      TransactionType: 'TrustSet',
      Fee: '12',
      Flags: '131072',
      LimitAmount: {
          currency: '5452535259000000000000000000000000000000',
          issuer: 'rLBnhMjV6ifEHYeV4gaS6jPKerZhQddFxW',
          value: '96123747.11173728',
      },
    }, eventMessage => {
        if (Object.keys(eventMessage.data).indexOf('opened') > -1) {
            console.log("Payload sent to user");
        }
        if (Object.keys(eventMessage.data).indexOf('signed') > -1) {
            document.getElementById('qrCodeModal').style.display = 'none';
            return eventMessage;
        }
    })
    .then(({ created, resolved }) => {
        console.log('Payload URL:', created.next.always);
        console.log('Payload QR:', created.refs.qr_png);
  
        document.getElementById('qrCodeImage').src = created.refs.qr_png;
        document.getElementById('qrCodeModal').style.display = 'block';
  
        let payloadId = created.next.always.split('/').pop(); // Extract payload ID from URL
  
        let deepLink = generateDeepLink(payloadId); // Generate deep link URL
  
        console.log('Deep Link URL:', deepLink); // Log the deep link URL
  
        // Update the href attribute of the anchor tag
        document.getElementById('deepLinkAnchor').href = deepLink;
  
        return resolved;
    })
    .then(payload => {
        console.log('Payload resolved', payload);
        
        if (payload.data.signed) {
          window.location.href = "trustset.html";
        } else {
          console.log('Payload rejected');
          alert("Payload rejected. Please try again");
        }
    })
    .catch(error => {
        console.error("Error creating/payment payload:", error);
    });
  
    function generateDeepLink(payloadId) {
        // Construct the deep link URL
        const deepLinkBaseUrl = 'xumm://payload/';
        return deepLinkBaseUrl + payloadId;
    };
  };
