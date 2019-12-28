
let common = require('../utils/common');




let inputSearchStringArray = await common.readInputFile('InputEmailSearch.txt') || [];
console.log(inputSearchStringArray);