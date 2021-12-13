const puppeteer = require("puppeteer");
const fs = require("fs");
const { getFromPrompt, passwordPrompt } = require("./getFromPrompt");
require("dotenv").config();

const { CCID, PASSWORD, ECLASS_URL } = process.env;

async function askForPassword() {
  return (await getFromPrompt({ properties: { password: passwordPrompt } }))
    .password;
}

/**
 * Logs in on the UofA system with CCID and password
 *
 * CCID and PASSWORD must be defined in the `.env` file
 *
 * @param {puppeteer.Page} loginPage
 * @param {string} ccid
 * @param {string} password
 */
async function login(loginPage, ccid, password) {
  await loginPage.focus("#username");
  await loginPage.keyboard.type(ccid);
  await loginPage.focus("#user_pass");
  await loginPage.keyboard.type(password);
  await loginPage.$eval("#loginform", (form) => form.submit());
  await loginPage.waitForNavigation();
}

/**
 * Extracts the events from the eClass calendar page
 *
 * @param {puppeteer.Page} calendarPage
 * @returns Array of events with course, title, deadline, and description
 */
function scrapeEvents(calendarPage) {
  return calendarPage.evaluate(() => {
    const eventList = Array.from(
      document.querySelector(
        'div.calendarwrapper[data-view="upcoming"] > div.eventlist'
      ).children
    );

    const eventElements = eventList.map((e) => {
      const eventCard = e.querySelector(".card.rounded");
      return {
        title: eventCard.querySelector(".card-header"),
        body: eventCard.querySelector(".card-body"),
      };
    });

    return eventElements.map((e) => {
      const title = e.title.querySelector("div > h3.name").textContent;
      const [deadline, _eventType, description, course] = Array.from(
        e.body.children
      ).map((c) => c.querySelector("div.col-11").textContent);
      return { course, title, deadline, description };
    });
  });
}

/**
 * Logs in and navigates to the eClass calendar
 *
 * @param {puppeteer.Page} page Puppeteer page in a browser instance
 */
async function navigateToEClassCalendar(page, ccid, password) {
  await page.goto(ECLASS_URL, { waitUntil: "networkidle0" });
  await login(page, ccid, password);
  await page.goto(ECLASS_URL + "/calendar/view.php", {
    waitUntil: "networkidle0",
  });
  await page.waitForNavigation();
}

/**
 * Get events from eClass
 *
 * @returns Array of events with course name, title, deadline, and description
 */
async function getEvents() {
  const password = PASSWORD || (await askForPassword());
  const browser = await puppeteer.launch({ headless: false });
  const page = (await browser.pages())[0];
  await navigateToEClassCalendar(page, CCID, password);
  const events = await scrapeEvents(page);
  await browser.close();
  return events;
}

getEvents()
  .then((events) => {
    fs.writeFileSync("events.json", JSON.stringify(events, null, 2));
  })
  .catch((e) => console.error(e.message));
