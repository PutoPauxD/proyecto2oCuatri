const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.goto('https://www.playcrey.com/game/262702');
  await page.setViewport({ width: 1366, height: 768});

  // Function to wait for the selector to appear on the page
  const waitForSelector = async (selector) => {
    await page.waitForSelector(selector);
  };

  // Function to scroll to the end of the document
  const scrollToBottom = async () => {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  };

  // Function to check if the button with class "loadMoreButton" exists
  const isLoadMoreButtonVisible = async () => {
    const loadMoreButton = await page.$('.LoadMoreButton--s207pg.ecknSK');
    return loadMoreButton !== null;
  };

  // Scroll to the end of the document and click the "loadMoreButton" if it exists
  const scrollAndClickLoadMoreButton = async () => {
    await scrollToBottom();
    const isButtonVisible = await isLoadMoreButtonVisible();
    if (isButtonVisible) {
      await page.waitForTimeout(1000); // Adjust the delay as needed
      await page.evaluate(() => {
        const loadMoreButton = document.querySelector('.LoadMoreButton--s207pg.ecknSK');
        if (loadMoreButton) {
            loadMoreButton.click();
        }
      });
      await scrollAndClickLoadMoreButton(); // Recursively check for more buttons
    } else {
      console.log("I did it");
    }
  };

  // Wait for the selector "p.body-text" to appear, then scroll and click the "loadMoreButton"
  await waitForSelector('p.body-text');
  await scrollAndClickLoadMoreButton();

  await browser.close();
})();