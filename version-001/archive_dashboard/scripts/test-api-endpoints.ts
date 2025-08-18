// Test API endpoints to verify they work
async function testApiEndpoints() {
  console.log("🔍 Testing API endpoints...");
  
  const baseUrl = "http://localhost:3001";
  
  try {
    // Test companies endpoint
    console.log("Testing GET /api/companies...");
    const companiesResponse = await fetch(`${baseUrl}/api/companies`);
    console.log("Companies response status:", companiesResponse.status);
    
    if (companiesResponse.status === 401) {
      console.log("✅ Companies endpoint requires authentication (expected)");
    } else if (companiesResponse.ok) {
      const companiesData = await companiesResponse.json();
      console.log("✅ Companies endpoint working:", companiesData);
    } else {
      console.log("❌ Companies endpoint error:", companiesResponse.statusText);
    }
    
    // Test brand monitor scrape endpoint
    console.log("\nTesting POST /api/brand-monitor/scrape...");
    const scrapeResponse = await fetch(`${baseUrl}/api/brand-monitor/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://acme.com',
        maxAge: 604800
      })
    });
    
    console.log("Scrape response status:", scrapeResponse.status);
    
    if (scrapeResponse.ok) {
      const scrapeData = await scrapeResponse.json();
      console.log("✅ Scrape endpoint working:", scrapeData);
    } else {
      console.log("❌ Scrape endpoint error:", scrapeResponse.statusText);
    }
    
    // Test dashboard page
    console.log("\nTesting GET /dashboard...");
    const dashboardResponse = await fetch(`${baseUrl}/dashboard`);
    console.log("Dashboard response status:", dashboardResponse.status);
    
    if (dashboardResponse.ok) {
      console.log("✅ Dashboard page accessible");
    } else {
      console.log("❌ Dashboard page error:", dashboardResponse.statusText);
    }
    
    console.log("\n🎉 API endpoint testing completed!");
    
  } catch (error) {
    console.error("❌ Error testing API endpoints:", error);
  }
}

// Run the test
testApiEndpoints();
