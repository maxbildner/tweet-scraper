const puppeteer = require("puppeteer");

// web scraping a twitter tweet's replies
async function scrapeReplies(tweetUrl) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(tweetUrl, { waitUntil: "networkidle2" });

  // Click the "Show more replies" button until all replies are loaded
  while (await page.$(".ThreadedConversation-showMoreThreadsButton")) {
    await page.click(".ThreadedConversation-showMoreThreadsButton");
    await page.waitForTimeout(1000); // wait for replies to load
  }

  // Get all the replies and extract their text
  const replies = await page.$$eval(".ThreadedConversation-tweet", (tweets) =>
    tweets.map((tweet) => tweet.querySelector(".tweet-text").textContent.trim())
  );

  await browser.close();

  return replies;
}

// Usage example
scrapeReplies("https://twitter.com/BionicOwls/status/1648673501379690496")
  .then((replies) => {
    console.log(replies);
  })
  .catch((error) => {
    console.error(error);
  });
