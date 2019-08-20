const readline = require('readline');
const fs = require('fs');

const readInterface = readline.createInterface({
  input: fs.createReadStream('amazon_mp3.dat'),
  // output: process.stdout,
  console: false
});

/**
#####1
[id]:0
[productId]:0
[standardName]:
[productName]:Rio PMP 300 MP3 Player
[title]:Great for people with internet not for people without
[author]:
[createDate]:Sun Jun 13 00:00:00 CST 1999
[summary]:
[fullText]:It is good if you have internet than you can download the stuff, else, you can't  
[rating]:2.0
[recommend]:0
[paid]:0.0
[helpfulNum]:0
[totalNum]:0
[commentNum]:0
[webHome]:http://www.amazon.com
[webUrl]:http://www.amazon.com/review/product/B00000JBAT/ref=cm_cr_dp_all_summary/002-2313684-7157658?%5Fencoding=UTF8&showViewpoints=1&sortBy=bySubmissionDateAscending
[htmlPath]:F:\amazon_mp3\1/1
[textPath]:
 */

 /*
    1. use `productName` as a key to group the same product and write them into one file
    2. format single product to the format as the TripAdvisor's review format
    <Review ID>UR126942521
    <Author>bklady
    <Author Location>Indiana
    <Title>“Beautiful location and great staff!”
    <Content>I recently visited for a conference and was enchanted by the beautiful city of San Diego. We were lucky enough to stay here and had a wonderful time. We arrived early in the morning and expected to stow our luggage and go until check-in, but the staff found a room for us. All the staff was extremely helpful and friendly. Bryan F. at the Tapatini was very charming and one of the hardest-working guys I've seen. The location on the Marina is lovely. It is a jaunt to downtown (about 2.5 miles), but it's a pretty walk. The Old Town Trolley does make a stop here in the morning and is a great way to explore the city. There is also a car rental place not too far. I would certainly return to this beautiful hotel anytime.
    <Date>March 29, 2012 
    <Overall>5.0
 */
let productMap = {};
let products = new Map();
let lastProductName = '';
readInterface.on('line', (line) => {
  if (line.indexOf('[id]:') > -1) {
    productMap['Review_ID'] = (""+Math.random()).substring(2,9);
  } else if (line.indexOf('[title]:') > -1) {
    const title = line.substring('[title]:'.length, line.length);
    productMap['Title'] = title;
  } else if (line.indexOf('[productName]:') > -1) {
    let productName = line.substring('[productName]:'.length, line.length);
    if (!lastProductName) {
      lastProductName = productName;
    }
    productMap['Product_Name'] = productName;
  } else if (line.indexOf('[fullText]:') > -1) {
    const fullText = line.substring('[fullText]:'.length, line.length);
    productMap['Content'] = fullText;
  } else if (line.indexOf('[rating]:') > -1) {
    const overall = line.substring('[rating]:'.length, line.length);
    productMap['Overall'] = parseFloat(overall);
  } else if (line.indexOf('[createDate]:') > -1) {
    const date = line.substring('[createDate]:'.length, line.length);
    productMap['Date'] = date;
  }
  
  if (line.indexOf('#####') > -1) {
    if (!products.get(productMap['Product_Name'])) {
      let ps = [];
      ps.push(productMap);
      products.set(productMap['Product_Name'],ps);
    } else {
      ps = products.get(productMap['Product_Name']);
      ps.push(productMap);
      products.set(productMap['Product_Name'],ps);
    }

    if (productMap['Product_Name'] !== lastProductName) {
      let groupedProducts = products.get(lastProductName);
      let str = '';
      if (groupedProducts) {
        // for (let sP of groupedProducts) {
        //   Object.entries(sP).forEach(([key, value]) => {
        //     str += `${key}${value}\n`;
        //   });
        //   str += '\n';
        // }
        let reviews = {"reviews":groupedProducts};
        str = JSON.stringify(reviews);
      }
      const filename = '/Users/l0j011d/Developers/LARA_python/data/amazon-data/'+(""+Math.random()).substring(2,9) + '.json';
      fs.writeFile(filename, str, (err) => {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
      });
      lastProductName = productMap['Product_Name'];
    }  

    // start productMap over
    productMap = {};
  }
})