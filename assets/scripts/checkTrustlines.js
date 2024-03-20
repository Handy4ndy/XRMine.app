async function checkTrustlines(account) {
    const client = new xrpl.Client("wss://xrplcluster.com");
    await client.connect();
  
    try {
      const response = await client.request({
        "command": "account_lines",
        "account": account,
      });
  
      document.getElementById("trustlineArea").textContent += JSON.stringify(response.result);
  
      // Define the currency you want to check for

      await xrmineTrustline(response);
      await treasuryTrustline(response);
      await utilitexTrustline(response);
      await nftempoTrustline(response);
      await swisstechTrustline(response);

      async function treasuryTrustline(response) {
        // Define the currency you want to check for
        const currencyToCheck = "5452535259000000000000000000000000000000";
      
        // Check if the specified currency is found in the account
        const currencyFound = response.result.lines.some(line => line.currency === currencyToCheck);
      
        if (currencyFound) {
          document.getElementById("trustlineArea").textContent += "Trustline for Treasury Found\n"
    
          // Hide the trustsetXrmine div
          document.getElementById("trustsetTreasury").style.display = "none";
          document.getElementById("treasuryMineBtn").style.display = "block";
      
          // Display the balance if the currency is found
          const balance = response.result.lines.find(line => line.currency === currencyToCheck).balance;
          document.getElementById("treasuryBalance").innerText = balance;
        } else {
          document.getElementById("trustlineArea").textContent += "Learn more about the XRPL though our Acadamy - TreasuryXRPL\n"
          // Show the trustsetXrmine div
          document.getElementById("trustsetTreasury").style.display = "block";
          document.getElementById("treasuryMineBtn").style.display = "none";
      
          function enableTrustSetBtn() {
            document.getElementById("trustSetTreasury").disabled = false;
            console.log("TrustSetBtn enabled"); // Debugging statement
          }
      
          document.getElementById("treasuryWpBtn").addEventListener("click", function () {
            console.log("Whitepaper button clicked"); // Debugging statement
            setTimeout(enableTrustSetBtn, 3000); // 3 minutes (180,000 milliseconds)
          });
        }
      }
      
      async function xrmineTrustline(response) {
        // Define the currency you want to check for
        const currencyToCheck = "58524D696E650000000000000000000000000000";
      
        // Check if the specified currency is found in the account
        const currencyFound = response.result.lines.some(line => line.currency === currencyToCheck);
      
        if (currencyFound) {
          document.getElementById("trustlineArea").textContent = "Trustline for XRmine Found\n"
    
          // Hide the trustsetXrmine div
          document.getElementById("trustsetXrmine").style.display = "none";
          document.getElementById("xrmineMineBtn").style.display = "block";
      
          // Display the balance if the currency is found
          const balance = response.result.lines.find(line => line.currency === currencyToCheck).balance;
          document.getElementById("xrmineBalance").innerText = balance;
        } else {
          document.getElementById("trustlineArea").textContent = "Explore our whitepaper, to set our trustline! -XRmine\n"
          // Show the trustsetXrmine div
          document.getElementById("trustsetXrmine").style.display = "block";
          document.getElementById("xrmineMineBtn").style.display = "none";
      
          function enableTrustSetBtn() {
            document.getElementById("trustSetXrmine").disabled = false;
            console.log("TrustSetBtn enabled"); // Debugging statement
          }
      
          document.getElementById("xrmineWpBtn").addEventListener("click", function () {
            console.log("Whitepaper button clicked"); // Debugging statement
            setTimeout(enableTrustSetBtn, 180000); // 3 minutes (180,000 milliseconds)
          });
        }
      }
      
      async function utilitexTrustline(response) {
        // Define the currency you want to check for
        const currencyToCheck = "5574696C69746558000000000000000000000000";
      
        // Check if the specified currency is found in the account
        const currencyFound = response.result.lines.some(line => line.currency === currencyToCheck);
      
        if (currencyFound) {
          document.getElementById("trustlineArea").textContent += "Trustline for Utilitex Found\n"
    
          // Hide the trustsetXrmine div
          document.getElementById("trustsetUtilitex").style.display = "none";
          document.getElementById("utilitexMineBtn").style.display = "block";
      
          // Display the balance if the currency is found
          const balance = response.result.lines.find(line => line.currency === currencyToCheck).balance;
          document.getElementById("utilitexBalance").innerText = balance;
        } else {
          document.getElementById("trustlineArea").textContent += "Discover how we support XRPL Startup's - Utilitex\n"
          // Show the trustsetXrmine div
          document.getElementById("trustsetUtilitex").style.display = "block";
          document.getElementById("utilitexMineBtn").style.display = "none";
      
          function enableTrustSetBtn() {
            document.getElementById("trustSetUtilitex").disabled = false;
            console.log("TrustSetBtn enabled"); // Debugging statement
          }
      
          document.getElementById("utilitexWpBtn").addEventListener("click", function () {
            console.log("Whitepaper button clicked"); // Debugging statement
            setTimeout(enableTrustSetBtn, 180000); // 3 minutes (180,000 milliseconds)
          });
        }
      }

      async function nftempoTrustline(response) {
        // Define the currency you want to check for
        const currencyToCheck = "XFT";
      
        // Check if the specified currency is found in the account
        const currencyFound = response.result.lines.some(line => line.currency === currencyToCheck);
      
        if (currencyFound) {
          document.getElementById("trustlineArea").textContent += "Trustline for FTX Found\n"
    
          // Hide the trustsetXrmine div
          document.getElementById("trustsetNftempo").style.display = "none";
          document.getElementById("nftempoMineBtn").style.display = "block";
      
          // Display the balance if the currency is found
          const balance = response.result.lines.find(line => line.currency === currencyToCheck).balance;
          document.getElementById("nftempoBalance").innerText = balance;
        } else {
          document.getElementById("trustlineArea").textContent += "Creating solution's for Web3 Music  - NFTempo\n"
          // Show the trustsetXrmine div
          document.getElementById("trustsetNftempo").style.display = "block";
          document.getElementById("nftempoMineBtn").style.display = "none";
      
          function enableTrustSetBtn() {
            document.getElementById("trustSetNftempo").disabled = false;
            console.log("TrustSetBtn enabled"); // Debugging statement
          }
      
          document.getElementById("nftempoWpBtn").addEventListener("click", function () {
            console.log("Whitepaper button clicked"); // Debugging statement
            setTimeout(enableTrustSetBtn, 180000); // 3 minutes (180,000 milliseconds)
          });
        }
      }
      
      async function swisstechTrustline(response) {
        // Define the currency you want to check for
        const currencyToCheck = "5377697373546563680000000000000000000000";
      
        // Check if the specified currency is found in the account
        const currencyFound = response.result.lines.some(line => line.currency === currencyToCheck);
      
        if (currencyFound) {
          document.getElementById("trustlineArea").textContent += "Trustline for SwissTech Found\n"
    
          // Hide the trustsetXrmine div
          document.getElementById("trustsetSwisstech").style.display = "none";
          document.getElementById("swisstechMineBtn").style.display = "block";
      
          // Display the balance if the currency is found
          const balance = response.result.lines.find(line => line.currency === currencyToCheck).balance;
          document.getElementById("swisstechBalance").innerText = balance;
        } else {
          document.getElementById("trustlineArea").textContent += "Innovating Airdrops on the XRPL! -Swisstech\n"
          // Show the trustsetXrmine div
          document.getElementById("trustsetSwisstech").style.display = "block";
          document.getElementById("swisstechMineBtn").style.display = "none";
      
          function enableTrustSetBtn() {
            document.getElementById("trustSetSwisstech").disabled = false;
            console.log("TrustSetBtn enabled"); // Debugging statement
          }
      
          document.getElementById("swisstechWpBtn").addEventListener("click", function () {
            console.log("Whitepaper button clicked"); // Debugging statement
            setTimeout(enableTrustSetBtn, 180000); // 3 minutes (180,000 milliseconds)
          });
        }
      }
      
      
      await xspectarTrustline(response);
      await radicalxTrustline(response);
      
    } catch (error) {
      console.error("Error checking trustlines:", error);
    }
  
    client.disconnect();
  }
  
