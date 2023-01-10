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

// Sort the records
function getSortedValue(records , field){
  if('score'===field){
    return records
  }
  if('payee_name'===field){
    return records.sort((r1,r2)=>r1.payee_name>r2.payee_name?1:-1)
  }
  if('town'===field){
    return records.sort((r1,r2)=>r1.town>r2.town?1:-1)
  }
  if('part_postcode'===field){
    return records.sort((r1,r2)=>r1.part_postcode>r2.part_postcode?1:-1)
  }
  if('county_council'===field){
    return records.sort((r1,r2)=>r1.county_council>r2.county_council?1:-1)
  }
  return records
}

async function getPaymentData(searchKey,limit, offset, searchBy) {
  const cachedData = await getCachedPaymentData();
  console.log("cachedData count : " + cachedData.length);

  // do search here
  const fuse = new Fuse(cachedData, fuseSearchOptions)
  const result = fuse.search(searchKey);
  const resultCount = result.length;
  if(resultCount<1) return [];
  const filteredItems = result.map(row => row.item);
  const sortedItems = getSortedValue(filteredItems,searchBy)
  const offsetBlock = sortedItems.slice(offset,limit)
  console.log("offsetBlock length: "+offsetBlock.length);
  return { count: resultCount, rows: offsetBlock }
}

module.exports = { getPaymentData }