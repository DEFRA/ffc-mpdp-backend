module.exports = {
  method: 'GET',
  path: '/downloadall',
  handler: (request, res) => {
    const file = "app/data/mpdp-data-file.csv";
    
    return res.file(file,{mode:'attachment',type:'text/csv'});
  }
}