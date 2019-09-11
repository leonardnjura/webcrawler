const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

let hackerNewsUrl = null;
let page = 1;
hackerNewsUrl = `https://cyware.com/hacker-news?p=${page}`;
request(hackerNewsUrl, (error, response, html) => {
  if (!error && response.statusCode == 200) {
    // console.log(html)
    // Write to html for local crawling
    const writeHtml = fs.createWriteStream('./html/hackernews.html');
    writeHtml.write(`${html}\n`);

    const $ = cheerio.load(html);
    // ENABLE IF SOURCING LOCAL HTML FILE
    // const $ = cheerio.load(fs.readFileSync('./html/hackernews.html'));

    let pageHeading = null;
    let output = null;

    // ONE ITEM
    pageHeading = $('.banner-heading').html();
    pageHeading = $('.banner-heading').text();
    // pageHeading = $('#branding')
    //   .find('h1')
    //   .text();
    console.log(pageHeading);

    // NOTES:
    /**
     * const entryContent = $(element).find('.entry-content').text() => grab all paragraphs
     * .text().replace(/\s\s+/g, '') => replace white space globally
     * .text().replace(/,/, '') => replace comma
     * Xpath
     * /html/body/div/table/tbody/tr[2]/td[4]
     * html > body > div > table > tbody > tr:nth-of-type(2) > td:nth-of-type(4)
     * div/ul[1]/li[1]
     * div > ul:nth-of-type(1) > li:nth-of-type(1)
     * */

    // LOOP ITEMS..
    let counter = 1;
    let pageList = []; // list
    let articleList = []; // list

    $('.post-content').each(function(index) {
      let item = {}; // obj
      let id = counter++; // my pk
      let articleLink = $(this)
        .find('h2 a')
        .attr('href'); // cleaner for reuse
      item['id'] = id;
      item['title'] = $(this)
        .find('h2')
        .text();
      item['link'] = articleLink
      item['time'] = $(this)
        .find('div > ul:nth-of-type(1) > li:nth-of-type(1)')
        .text()
        .replace(/\s\s+/g, '');
      item['post_image'] = $(this)
        .find('img')
        .attr('data-url');
      generateArticleData(articleLink)
        .then(data => {
          scrapeArticleData(data, id);
          // console.log(articleList);
          // Write to JSON@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
          const pathToJsonFile = './data/hackernewsArticles.json';
          fs.writeFileSync(
            pathToJsonFile,
            JSON.stringify({ hackernewsArticles: articleList }, null, '\t')
          );
          console.log('Updated articles list, see ', pathToJsonFile);
          // Writen to JSON@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        })
        .catch(error => console.log(error));

      pageList.push(item);
    });

    // JSON..
    console.log({ hackernews: pageList });

    // LINES..
    const writeTxt = fs.createWriteStream('./data/hackernews.txt');
    for (item in pageList) {
      const id = pageList[item].id;
      const title = pageList[item].title.toLowerCase();
      const link = pageList[item].link;
      const time = pageList[item].time;
      const post_image = pageList[item].post_image;
      // console.log(`${id}\n${title}\n${link}\n${time}\n${post_image}\n`)
      // Write to Txt File
      writeTxt.write(`${id}\n${title}\n${link}\n${post_image}\n${time}\n\n`);
    }

    // Write to JSON@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    const pathToJsonFile = './data/hackernews.json';
    fs.writeFileSync(
      pathToJsonFile,
      JSON.stringify({ hackernews: pageList }, null, '\t')
    );
    console.log('Saved to', pathToJsonFile);
    // Writen to JSON@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    console.log('Scraping done..');


    function generateArticleData(articleUrl) {
      // SCRAPE EACH ARTICLE PAGE, grab async list in console, :)
      return new Promise((resolve, reject) => {
        request(articleUrl, (error, res, htmlData) => {
          if (error) reject(error);
          else resolve(htmlData);
        });
      });
    }

    function scrapeArticleData(html, id) {
      const $ = cheerio.load(html);

      let headline = $('.post-title')
        .text()
        .replace(/\s\s+/g, '');
      let article = $('.journal-content')
        .text()
        .replace(/\s\s+/g, '');

      // console.log({ headline, article });
      let articleItem = {}; // obj
      articleItem['id'] = id;
      articleItem['headline'] = headline;
      articleItem['article'] = article;

      console.log(`working on article ${id}..`);
      articleList.push(articleItem);
    }
  }
});
