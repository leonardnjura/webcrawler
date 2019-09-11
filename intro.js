const request = require('request');
const cheerio = require('cheerio');

let hackerNewsUrl = `http://www.spacerogue.net/wordpress`;
request(hackerNewsUrl, (error, response, html) => {
  if (!error && response.statusCode == 200) {
    // console.log(html)
    const $ = cheerio.load(html);

    let pageHeading = null

    // ONE ITEM
    pageHeading = $('#branding').html();
    pageHeading = $('#branding').text();
    pageHeading = $('#branding').find('h1').text();
    console.log(pageHeading);

    // LOOP ITEMS
    $('.entry-title a').each((i, el) => {
        const item = $(el).text()
        const link = $(el).attr('href')
        console.log(item, link)
    })
  }
});
