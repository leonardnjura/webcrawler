const express = require('express');
const app = express();

const craigslist = require('./data/craigslist.json');
const hackernews = require('./data/hackernews.json');
const hackernews_articles = require('./data/hackernewsArticles.json');

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
  hackernews_articles: `${host}/hackernews_articles`,
  craigslist: `${host}/craigslist`
};

app.get('/', (req, res) => {
  res.json({ msg: 'welcome to my web crawler', featured });
});

app.get('/hackernews', (req, res) => {
  res.json(hackernews);
});
app.get('/hackernews/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  var data = hackernews_articles.hackernewsArticles;
  var wantedArticle = data.filter(i => i.id == id);
  res.json(wantedArticle);
});
app.get('/hackernews_articles', (req, res) => {
  res.json(hackernews_articles);
});
app.get('/hackernews_articles/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  var data = hackernews_articles.hackernewsArticles;
  var wantedArticle = data.filter(i => i.id == id);
  res.json(wantedArticle);
});

app.get('/craigslist', (req, res) => {
  res.json(craigslist.article);
});

const mode = isDevMode ? 'DevMode' : 'ProductionMode';
app.listen(PORT, () => {
  console.log({ mode });
  console.log(`Scraper server running on port ${PORT}..`);
});
