const Fuse = require('fuse.js');
const { getAllPaymentData } = require('../services/databaseService')

// Locally cached data
let localCachedData=null ;
async function getCachedPaymentData() {
  if(!localCachedData){
    localCachedData = await getAllPaymentData();
    // console.log("local caching the value as : ");
    // console.log(localCachedData);
  }
  return localCachedData;
}

// search configuration
const fuseSearchOptions = {
  includeScore: true,
  threshold: .3,
  ignoreLocation: true,
  useExtendedSearch: true,
  keys: ["payee_name", "part_postcode", "town", "county_council"]
}

async function getPaymentData(searchKey,limit, offset, searchBy) {
  const cachedData = await getCachedPaymentData();
  console.log("cachedData count : " + cachedData.length);

  // do search here
  const fuse = new Fuse(cachedData, fuseSearchOptions)
  const result = fuse.search(searchKey);
  const resultCount = result.length;
  if(resultCount<1) return [];
  // result.map(row => console.log(row.score))
  const filteredItems = result.map(row => row.item);
  const offsetBlock = filteredItems.slice(offset,limit)
  console.log("offsetBlock length: "+offsetBlock.length);
  // TODO : sort the result by given field
  return { count: resultCount, rows: offsetBlock }
}

module.exports = { getPaymentData }