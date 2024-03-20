async function radicalxTrustline(response) {
    // Define the currency you want to check for
    const currencyToCheck = "XDX";
  
    // Check if the specified currency is found in the account
    const currencyFound = response.result.lines.some(line => line.currency === currencyToCheck);
  
    if (currencyFound) {
      document.getElementById("trustlineArea").textContent += "Trustline for XDX Found\n"

      // Hide the trustsetXrmine div
      document.getElementById("trustsetRadicalx").style.display = "none";
      document.getElementById("radicalxMineBtn").style.display = "block";
  
      // Display the balance if the currency is found
      const balance = response.result.lines.find(line => line.currency === currencyToCheck).balance;
      document.getElementById("radicalxBalance").innerText = balance;
    } else {
      document.getElementById("trustlineArea").textContent += "Exchange in any currency on Radical-X - DPMonksFinance\n"
      // Show the trustsetXrmine div
      document.getElementById("trustsetRadicalx").style.display = "block";
      document.getElementById("radicalxMineBtn").style.display = "none";
  
      function enableTrustSetBtn() {
        document.getElementById("trustSetRadicalx").disabled = false;
        console.log("TrustSetBtn enabled"); // Debugging statement
      }
  
      document.getElementById("radicalxWpBtn").addEventListener("click", function () {
        console.log("Whitepaper button clicked"); // Debugging statement
        setTimeout(enableTrustSetBtn, 180000); // 3 minutes (180,000 milliseconds)
      });
    }
  }
  