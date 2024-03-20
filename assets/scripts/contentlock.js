
document.addEventListener('DOMContentLoaded', (event) => {
    // This code will run after the DOM is fully loaded
    // Wait for 5 seconds (5000 milliseconds) before checking the accountAddress
    setTimeout(() => {
        let accountAddress = document.getElementById("accountaddress").innerText.trim();

        if (accountAddress === "...") {
            sessionStorage.setItem("isLoggedIn", "false");
            sessionStorage.setItem("burnRequestSigned", "false");
            xumm.logout();
        }


    }, 2000);

});