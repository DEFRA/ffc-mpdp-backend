const paymentData = require('../data/paymentdata.json');
const Fuse = require('fuse.js');

function getPaymentData(searchKey,limit, offset) {
  // search configuration
  const options = {
    includeScore: true,
    threshold: .3,
    ignoreLocation: true,
    useExtendedSearch: true,
    keys: ["payee_name", "part_postcode", "town", "county_council"]
  }

  // do search here
  console.log("inside onSearch...");
  const fuse = new Fuse(paymentData, options)
  const result = fuse.search(searchKey);
  // console.log(result)
  // console.log("result :" + result)
  const resultCount = result.length;
  console.log("resultCount:" + resultCount)
  const emptyArray = [];
  if(resultCount<1) return emptyArray;
  result.map(row => console.log(row.score))
  const filteredItems = result.map(row => row.item);
  const offsetBlock = filteredItems.slice(offset,limit)
  console.log("offsetBlock:")
  console.log("sending result")
  return { count: resultCount, rows: offsetBlock }
}

module.exports = { getPaymentData }
