const __log = console.log
console.log = function(){}
let db_obj = require('./dbwrapper')
let snoopdog = new db_obj
let resp = snoopdog.vigenciaOptionsArray('2020-01-10')
console.log = __log
console.log(resp)
