var xumm = new Xumm("XAMAN_APIKEY");

const burnRequestSigned = sessionStorage.getItem('burnRequestSigned');
const isLoggedIn = sessionStorage.getItem('isLoggedIn');

document.addEventListener("DOMContentLoaded", function () {
    console.log("window loaded, cleared previous session");
    sessionStorage.setItem("isLoggedIn", "false");
    sessionStorage.setItem("burnRequestSigned", "false");
    xumm.logout(); 
});

xumm.on("ready", () => console.log("Ready- Awaiting user sign in"));

xumm.on("success", async () => {
  sessionStorage.setItem("isLoggedIn", "true");
  console.log("Sign in completed, initiating burn transaction");
  initiatePaymentAndSubscribe();
});

xumm.on("logout", async () => {
  console.log("Session ended, User has been logged out");
  exit();
});

function exit() {
  alert("User has been logged out, Returning to home page");
  sessionStorage.removeItem("isLoggedIn");
  sessionStorage.removeItem("burnRequestSigned");
  window.location.href = "index.html";
}

function closeQRCodeModal() {
  document.getElementById("qrCodeModal").style.display = "none";
  xumm.logout();
}

/*document.addEventListener('DOMContentLoaded', function () {
    // Check if the user is logged in
    let isLoggedIn = sessionStorage.getItem('isLoggedIn')

    if (isLoggedIn) {
        // User is logged in, perform any necessary cleanup
        console.log("User logged out");
        xumm.logout();
    }
}); */
