async function xspectarTrustline(response) {
    // Define the currency you want to check for
    const currencyToCheck = "7853504543544152000000000000000000000000";
  
    // Check if the specified currency is found in the account
    const currencyFound = response.result.lines.some(line => line.currency === currencyToCheck);
  
    if (currencyFound) {
      document.getElementById("trustlineArea").textContent += "Trustline for xSPECTAR Found\n"

      // Hide the trustsetXrmine div
      document.getElementById("trustsetXspectar").style.display = "none";
      document.getElementById("xspectarMineBtn").style.display = "block";
  
      // Display the balance if the currency is found
      const balance = response.result.lines.find(line => line.currency === currencyToCheck).balance;
      document.getElementById("xspectarBalance").innerText = balance;
    } else {
      document.getElementById("trustlineArea").textContent += "Building the Metaverse on the XRPL! -xSPECTAR\n"
      // Show the trustsetXrmine div
      document.getElementById("trustsetXspectar").style.display = "block";
      document.getElementById("xspectarMineBtn").style.display = "none";
  
      function enableTrustSetBtn() {
        document.getElementById("trustSetXspectar").disabled = false;
        console.log("TrustSetBtn enabled"); // Debugging statement
      }
  
      document.getElementById("xspectarWpBtn").addEventListener("click", function () {
        console.log("Whitepaper button clicked"); // Debugging statement
        setTimeout(enableTrustSetBtn, 180000); // 3 minutes (180,000 milliseconds)
      });
    }
  }
  