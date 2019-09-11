const express = require('express');
const app = express();
const port = 3050;

// const getUrls = require('get-urls');
const craigslist = require('./data/craigslist.json');
const _3dheat = require('./data/3dheat.json');
const hackernews = require('./data/hackernews.json');

// middleware
app.use(express.json());


app.get('/', (req, res) => {
  res.json({ msg: 'welcome to my web crawler', info: 'my crawler or scraper uses cheerio for old school sites and nigtmare for contemporary sites made in angularjs and reactjs', featured: 'hackernews, craigslist, 3dheat' });
});

app.get('/hackernews', (req, res) => {
  res.json(hackernews);
});
app.get('/craigslist', (req, res) => {
  res.json(craigslist);
});
app.get('/3dheat', (req, res) => {
  res.json(_3dheat);
});


app.listen(port, () => {
  console.log(`Scraper server running on port ${port}..`);
});
