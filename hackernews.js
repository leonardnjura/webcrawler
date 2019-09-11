const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

let hackerNewsUrl = `http://www.spacerogue.net/wordpress`;
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
    pageHeading = $('#branding').html();
    pageHeading = $('#branding').text();
    pageHeading = $('#branding')
      .find('h1')
      .text();
    console.log(pageHeading);

    // NOTES:
    /**
     * const entryContent = $(element).find('.entry-content').text() => grab all paragraphs
     * .text().replace(/\s\s+/g, '') => replace white space globally
     * .text().replace(/,/, '') => replace comma
     * */

    // LOOP ITEMS..
    let pageList = []; // list
    $('.post').each(function(index) {
      let item = {}; // obj
      item['title'] = $(this)
        .find('h1')
        .text();
      item['link'] = $(this)
        .find('h1 a')
        .attr('href');
      item['time'] = $(this)
        .find('time')
        .text();
      item['intro'] = $(this)
        .find('p:first-child')
        .text(); // grab first paragraph
      item['article'] = $(this)
        .find('p')
        .text(); // grab all paragraphs

      pageList.push(item);
    });

    // JSON..
    console.log({ hackernews: pageList });

    // LINES..
    const writeTxt = fs.createWriteStream('./data/hackernews.txt');
    for (item in pageList) {
      const title = pageList[item].title.toLowerCase();
      const link = pageList[item].link;
      const time = pageList[item].time;
      const intro = pageList[item].intro;
      // console.log(`${title}\n${link}\n${time}\n${intro}\n`)
      // Write to Txt File
      writeTxt.write(`${title}\n${link}\n${intro}\n${time}\n\n`);
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
  }
});
