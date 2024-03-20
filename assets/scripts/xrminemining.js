var xumm = new Xumm('XAMAN_APIKEY');

xumm.on("ready", () => console.log("Ready to Mine!!"));

xumm.user.account.then(account => {
    console.log(account + " has been transferred to the mining page");
    document.getElementById("accountaddress").innerText = account;
    checkBalances(account);
});

xumm.on("logout", async () => {
    console.log("User logged out, Returning to home page");
    window.location.href = "index.html";
  });