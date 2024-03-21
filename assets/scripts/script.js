var xumm = new Xumm('${{ secrets.XAMAN_APIKEY }}');

xumm.on("ready", () => console.log("Ready to explore whitepapers and set trustlines"));

const burnRequestSigned = sessionStorage.getItem('burnRequestSigned');
const isLoggedIn = sessionStorage.getItem('isLoggedIn');

document.addEventListener('DOMContentLoaded', function () {

  if (burnRequestSigned && isLoggedIn) {
      console.log("User sign in success, Burn transaction complete");
  }
  
});

xumm.user.account.then(account => {
    checkSignIn();
    console.log(account + " has been connected, Welcome to XRmine!!!!");
    document.getElementById("accountaddress").innerText = account;
    checkTrustlines(account);
});

function checkSignIn(){

  if (!burnRequestSigned && isLoggedIn){
    console.log("Burn transaction error")
    xumm.logout();
  }

}

xumm.on("logout", async () => {
  sessionStorage.removeItem('burnRequestSigned');
  sessionStorage.removeItem('isLoggedIn')
  console.log("User logged out, Returning to home page");
  window.location.href = "index.html";
});

function closeQRCodeModal() {
  document.getElementById('qrCodeModal').style.display = 'none';
  alert("Transaction has not been signed!, please check Xaman Events page")
}