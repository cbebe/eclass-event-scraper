# eClass Events Scraper

Scrapes for Calendar Events in eClass using Puppeteer

Run `yarn start` to get all Calendar events on eClass. The scraped data is saved in `events.json`.

Example `events.json`:

```json
[
  {
    "course": "2021-2022 Co-op eConnect - a Community of Co-ops  ",
    "title": "Submit WkExp 905 Report - Fall  2021 is due",
    "deadline": "Friday, 31 December, 11:59 PM",
    "description": "... Long assignment description ..."
  },
  {
    "title": "eClass Maintenance Outage",
    "deadline": "Monday, 3 January, 12:00 AM » 11:59 PM",
    "description": "There is a scheduled maintenance outage for eClass on January 3rd, 2022."
  }
]
```

## Why

I've missed too many assignments and quizzes because I don't check eClass regularly.

## Setup

Run `yarn setup` to prompt for CCID, and password.  
Alternatively, you can copy the `.env.example` file into `.env` and fill out the variables yourself.

## TODO

- Exit on incorrect password
