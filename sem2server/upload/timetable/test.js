var XLSX = require('xlsx');
var fs = require('fs');
var workbook = XLSX.readFile('T1804M.xlsx');
var data = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1'], {
  header: 1
});
let index = data.reverse().findIndex(x => x.length > 0);
data = data.filter((x, i) => i >= index);
fs.writeFile('result.json', JSON.stringify(data.reverse()), (x) => {
  if (x) {
    console.log(x);
  }
})
