const paymentData = require('../data/paymentdata.json');
const Fuse = require('fuse.js');
const { createClient }  = require('redis');
const { getAllPaymentData } = require('../services/databaseService')


//----- This uses the Redis cache
async function getRedisCachedPaymentData() {
  const REDIS_URL = 'redis://host.docker.internal:6379'
  const allPaymentDataKey = 'allPaymentData'
  const client = createClient({ url: REDIS_URL });

  client.on('error', (err) => console.log('Redis Client Error', err));
  await client.connect();
  const existCount = await client.exists(allPaymentDataKey)
  if(existCount === 1) {
    console.log('exists');
    const value = await client.get(allPaymentDataKey);
    // console.log("value is : "+ value)
    const jsonValue = JSON.parse(value);
    // console.log("jsonValue is : ")
    // console.log(jsonValue)
    return jsonValue;
  } else {
    console.log('doesnot exist');
    // const dbValue = {"name" : "velCached"}
    const dbValue = await getAllPaymentData();
    // console.log("setting the value as : ");
    // console.log(dbValue);
    await client.set(allPaymentDataKey, JSON.stringify(dbValue));
    // console.log("setting complete ");
    return dbValue;
  }
  await client.disconnect();
}


//------ This uses the locally cached data without Redis
let localCachedData=null ;
async function getLocalCachedPaymentData() {
  if(!localCachedData){
    localCachedData = await getAllPaymentData();
    // console.log("local caching the value as : ");
    // console.log(localCachedData);
  }
  return localCachedData;
}



async function getPaymentData(searchKey,limit, offset) {
  // const cachedData = paymentData
  // const cachedData = await getRedisCachedPaymentData();
  const cachedData = await getLocalCachedPaymentData();

  console.log("cachedData count : " + cachedData.length);
  // console.log(cachedData);

  // search configuration
  const options = {
    includeScore: true,
    threshold: .3,
    ignoreLocation: true,
    useExtendedSearch: true,
    keys: ["payee_name", "part_postcode", "town", "county_council"]
  }

  // do search here
  const fuse = new Fuse(cachedData, options)
  const result = fuse.search(searchKey);
  // console.log("result :")
  // console.log(result)
  const resultCount = result.length;
  // console.log("resultCount:" + resultCount)
  const emptyArray = [];
  if(resultCount<1) return emptyArray;
  // result.map(row => console.log(row.score))
  const filteredItems = result.map(row => row.item);
  const offsetBlock = filteredItems.slice(offset,limit)
  // console.log("offsetBlock:")
  // console.log(offsetBlock)
  return { count: resultCount, rows: offsetBlock }
}

module.exports = { getPaymentData }
