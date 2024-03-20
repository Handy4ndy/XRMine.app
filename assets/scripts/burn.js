function initiatePaymentAndSubscribe() {
    xumm.payload.createAndSubscribe({
        TransactionType: 'Payment',
        Destination: 'rfXMq3BMX2dTzJtG4pnhr49u6sHkVQXpWL',
        Amount: {
            currency: '58524D696E650000000000000000000000000000',
            value: '0.5',
            issuer: 'rfXMq3BMX2dTzJtG4pnhr49u6sHkVQXpWL'
        },
        'Fee': '12',
        'Flags': '2147483648',
    }, eventMessage => {
        if (Object.keys(eventMessage.data).indexOf('opened') > -1) {
            console.log("Payload opened in Xaman");
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
        
        if (payload.data && payload.data.signed) {
            sessionStorage.setItem('burnRequestSigned', 'true');
            window.location.href = "trustset.html";
        } else {
            console.log("Payload rejected. Returning to home page");
            xumm.logout();
            window.location.href = "index.html";
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
