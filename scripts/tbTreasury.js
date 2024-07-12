async function checkBalances(account) {
    const client = new xrpl.Client("wss://xrplcluster.com");
    await client.connect();
  
    try {
      const response = await client.request({
        "command": "account_lines",
        "account": account,
      });
      
      console.log(response.result)
      JSON.stringify(response.result)

      const currencyToCheck = "5452535259000000000000000000000000000000"
      const balance = response.result.lines.find(line => line.currency === currencyToCheck).balance;

          document.getElementById("TreasuryBalance").innerText = "Token Balance:" + balance;
      //document.getElementById("trustlineArea").textContent += JSON.stringify(response.result);
    } catch (error) {
        console.error("Error checking token balance:", error);
      }
    
    try {
        const response = await client.request({
          "command": "account_lines",
          "account": "rPBYqXye7rJFQ9HzwfYYW88SbuKv5P9cHK",
        });
        
        console.log(response.result)
        JSON.stringify(response.result)
  
        const currencyToCheck = "5452535259000000000000000000000000000000"
        const balance = response.result.lines.find(line => line.currency === currencyToCheck).balance;
  
            document.getElementById("dropRemaining").innerText = "Drop Balance:" + balance;
        //document.getElementById("trustlineArea").textContent += JSON.stringify(response.result);
      } catch (error) {
          console.error("Error checking drop wallet:", error);
        }

        try {
            const response = await client.request({
                command: "account_lines",
                account: "rLBnhMjV6ifEHYeV4gaS6jPKerZhQddFxW", // Issuer address
            });
        
            console.log(response.result);
            JSON.stringify(response.result);
        
            const currencyToCheck = "5452535259000000000000000000000000000000"; // Token currency code
            const balance = response.result.lines.find(line => line.currency === currencyToCheck).balance;
        
            // Take the absolute value of the balance
            const absoluteBalance = Math.abs(balance);
        
            document.getElementById("issuerBalance").innerText = "Issuer Balance: " + absoluteBalance;
            //document.getElementById("trustlineArea").textContent += JSON.stringify(response.result);
        } catch (error) {
            console.error("Error checking issuer balance:", error);
        }


    
      client.disconnect();
    }
    