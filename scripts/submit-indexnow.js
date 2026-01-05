const payload = {
  host: "www.freecompoundcalculator.com", // Your domain name WITHOUT https://
  key: "116ae2da00b347919387609cb4c5e5c4", // Your exact key (e.g., 'abc123def')
  keyLocation: "https://www.freecompoundcalculator.com/116ae2da00b347919387609cb4c5e5c4.txt", // Full URL to the key file
  urlList: [
    "https://www.freecompoundcalculator.com/",
    "https://www.freecompoundcalculator.com/about/",
  "https://www.freecompoundcalculator.com/advanced-calculator/",
  "https://www.freecompoundcalculator.com/basic-calculator/",
  "https://www.freecompoundcalculator.com/contact/",
  "https://www.freecompoundcalculator.com/free-compound-interest-calculator/",
  "https://www.freecompoundcalculator.com/privacy-policy/",
  "https://www.freecompoundcalculator.com/retirement-planner/",
  "https://www.freecompoundcalculator.com/savings-calculator/"
  ]
};

fetch('https://www.bing.com/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
.then(response => console.log('Response Status:', response.status))
.catch(error => console.error('Network Error:', error));