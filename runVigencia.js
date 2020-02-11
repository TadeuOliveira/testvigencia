let alias = {
	voa: 'vigenciaOptionsArray',
	cv: 'computeVigencia'
}	
const snooplog = console.log
const getopts = require("getopts")

const options = getopts(process.argv.slice(2), {
  alias: {
    help: "h",
    test: "t",
    date: "d",
    quiet: "q"
  },
  default: {
    test: 'computeVigencia',
    date: new Date().toISOString().substr(0,10),
    quiet: false
  }
})

if (options.help) {
  snooplog("é assim que se usa essa porra:\n\x1b[33mnode runVigencia.js [-t|--test=T] [-d|--date=D] [-q|--quiet]\x1b[0m")
  snooplog("T pode ser cv|computeVigencia ou voa|vigenciaOptionsArray")
  process.exit(0)
}

if (options.quiet) {
	console.log = function(){}
}

//console.log('eu não estou quieto')
let arg
const db_obj = require('./dbwrapper')
let snoopdog = new db_obj

if (options.test) {
	arg = alias.hasOwnProperty(options.test) ? 
		alias[options.test] :
		options.test
	if(!Object.values(alias).includes(arg)){
		snooplog('\x1b[31mtipo de teste não encontrado\x1b[0m')
		process.exit(1)
	}
} 
else {
	arg = options.test
}

let resp = eval("snoopdog."+arg+"('"+options.date+"')")
if(typeof resp == 'string') resp = "\x1b[33m"+resp+"\x1b[0m"
snooplog(resp)

process.exit(0)
