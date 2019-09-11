const express = require('express');
const app = express();

const craigslist = require('./data/craigslist.json');
const hackernews = require('./data/hackernews.json');

const { NODE_ENV } = process.env;
const isDevMode = NODE_ENV === 'development';
const isProductionMode = NODE_ENV === 'production';
const PORT = process.env.PORT || 3050;

// middleware
app.use(express.json());

let host = `http://localhost:${PORT}`;

if (isProductionMode) {
  host = 'https://lno-webcrawler.herokuapp.com';
}

const featured = {
  hackernews: `${host}/hackernews`,
  craigslist: `${host}/craigslist`
};

app.get('/', (req, res) => {
  res.json({ msg: 'welcome to my web crawler', featured });
});

app.get('/hackernews', (req, res) => {
  res.json(hackernews);
});
app.get('/craigslist', (req, res) => {
  res.json(craigslist);
});

const mode = isDevMode ? 'DevMode' : 'ProductionMode';
app.listen(PORT, () => {
  console.log({ mode });
  console.log(`Scraper server running on port ${PORT}..`);
});
