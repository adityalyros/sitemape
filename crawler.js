const axios = require('axios');
const cheerio = require('cheerio');

const baseUrl = 'https://sitemap.com'; // Your base URL

async function crawlPage(url, indentation = '') {
  try {
    // Fetch HTML content of the URL
    const response = await axios.get(url);
    
    // Parse HTML content using cheerio
    const $ = cheerio.load(response.data);
    
    // Extract links from the parsed HTML
    const links = $('a').map((_, element) => $(element).attr('href')).get();
    
    // Print the current URL with appropriate indentation
    console.log(`${indentation}${url}`);
    
    // Iterate over extracted links
    for (const link of links) {
      let newUrl = link;
      // Check if the link is relative
      if (!newUrl.startsWith('http')) {
        if (newUrl.startsWith('/')) {
          // Prepend the base URL to make it absolute
          newUrl = baseUrl + newUrl;
        } else {
          continue; // Skip unsupported URLs for now
        }
      }
      // Recursively call crawlPage with the new URL and increased indentation
      await crawlPage(newUrl, `${indentation}\t`);
    }
  } catch (error) {
    console.error(`Error crawling ${url}: ${error.message}`);
  }
}

// Your other code will go here...

// Export the crawlPage function if needed
module.exports = crawlPage;
