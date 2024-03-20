function setUtilitexTrustline() {
  xumm.payload.createAndSubscribe({
    TransactionType: 'TrustSet',
    Fee: '12',
    Flags: '131072',
    LimitAmount: {
        currency: '5574696C69746558000000000000000000000000',
        issuer: 'rKDsnVfFMzdqrU8Bqno37d29L8ZW3hvrf8',
        value: '69920046.23494522'
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
  }
}
  