let xumm;
let currentImage = 1;
        let clicksRequired = Math.floor(Math.random() * 10) + 1; // Random clicks required from 1 to 10
    
        function mineImageClick() {
            if (currentImage === 5) {
                // Show an alert when the 5th image is clicked
                alert("You mined 5 XRmine tokens");
                sendTokens();
        
            } else {
                // Increment the click count
                clicksRequired--;
    
                if (clicksRequired === 0) {
                    // Hide the current image
                    document.getElementById(`mineImg${currentImage}`).style.display = "none";
                    
                    // Show the next image
                    currentImage++;
                    document.getElementById(`mineImg${currentImage}`).style.display = "block";
    
                    // Generate a new random click count
                    clicksRequired = Math.floor(Math.random() * 10) + 1;
                }
            }
        }
    
        // Initially, hide images 2 to 5
        for (let i = 2; i <= 5; i++) {
            document.getElementById(`mineImg${i}`).style.display = "none";
        }
    
        let engagementCount = 0;
    
    function increaseEngagement() {
        if (engagementCount < 3) {
            engagementCount++;
            document.getElementById('engagementBonus').textContent = `Engagement Bonus (x${engagementCount})`;
        }
    }
    
    // Attach the click event to your buttons
    document.querySelector('.webAddress').addEventListener('click', increaseEngagement);
    document.querySelector('.socialchannel').addEventListener('click', increaseEngagement);
    document.querySelector('.distribution').addEventListener('click', increaseEngagement);


// Fetch API key
fetch("/api/key")
  .then((response) => response.json())
  .then((data) => {
    const XUMM_API_KEY = data.apiKey;

    // Initialize xumm
    xumm = new Xumm(XUMM_API_KEY);


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

  });
