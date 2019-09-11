const Nightmare = require('nightmare'),
  nightmare = Nightmare({ show: true });
const fs = require('fs');

let city = process.argv[2] || 'newyork';
let url = `http://${city}.craigslist.org/search/cpg?is_paid=yes&postedToday=1`;

if (city != 'newyork') {
  url = `http://${city}.craigslist.org/search/hss?postedToday=0`;
}

nightmare
  .goto('https://google.com') //navigates to google
  .wait(2000)
  .type('[class="gLFyf gsfi"]', `craigslist ${city}`) //types 'sweetcode' into the search bar
  .wait(2000)
  .click('[name="btnK"]') //clicks the search button
  .wait(5000)

  .evaluate(() => {
    const title = document.querySelector('title').innerText;
    return title;
  })

  .then(title => {
    if (title == `craigslist ${city} - Google Search`) {
      return nightmare
        .goto(url)
        .wait(2000)
        .evaluate(() => {
          const htmlTitle = document.querySelector('title').innerText;
          const html = document.body.innerHTML;
          const pageTitle = $('.cattitle')
            .text()
            .replace(/\s\s+/g, '');

          // LOOP ITEMS..
          let pageList = []; // list
          $('.result-row').each(function(index) {
            let item = {}; // obj
            item['title'] = $(this)
              .find('.hdrlnk')
              .text();
            item['link'] = $(this)
              .find('.hdrlnk')
              .attr('href');
            item['date'] = $(this)
              .find('.result-date')
              .text();
            item['datetime'] = $(this)
              .find('.result-date')
              .attr('datetime');
            item['hood'] = $(this)
              .find('.result-hood')
              .text()
              .replace(/\(|\)/g, '')
              .trim();
            pageList.push(item);
          });

          // return pageList

          let combo = []; // items array
          let item = {}; // item obj
          item['htmlTitle'] = htmlTitle;
          item['html'] = html;
          item['pageTitle'] = pageTitle;
          item['pageList'] = pageList;
          combo.push(item);

          return combo;
        });
    } else {
      return nightmare.goto('http://dart.dev');
    }
  })
  .then(results => {
    //results is the output of the above line
    // JSON..
    console.log({ results });
    const pageList = results[0].pageList;
    const html = results[0].html;
    // Write to Html File
    const writeHtml = fs.createWriteStream('./html/craigslist.html');
    writeHtml.write(`${html}`);

    // JSON..
    console.log({ craigslist: pageList });

    // LINES..
    const writeTxt = fs.createWriteStream('./data/craigslist.txt');
    for (item in pageList) {
      const title = pageList[item].title.toLowerCase();
      const link = pageList[item].link;
      const date = pageList[item].date;
      const datetime = pageList[item].datetime;
      const hood = pageList[item].hood;
      console.log(`${title}\n${link}\n${date}\n${datetime}\n${hood}\n`);
      // Write to Txt File
      writeTxt.write(`${title}\n${link}\n${date}\n${datetime}\n${hood}\n\n`);
    }

    // Write to JSON@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    const pathToJsonFile = './data/craigslist.json';
    fs.writeFileSync(
      pathToJsonFile,
      JSON.stringify({ craigslist: pageList }, null, '\t')
    );
    console.log('Saved to', pathToJsonFile);
    // Writen to JSON@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    console.log('Scraping done..');
    return nightmare.end();
  })
  .catch(err => {
    console.log(err);
  });
