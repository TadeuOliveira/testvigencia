let assertions = require('./assertions/assertions')

const ordenacao = (a,b) => {
	if(a.hasOwnProperty('id')){
		return new Date(a.id) - new Date(b.id)
	}
	return new Date(a) - new Date(b)	
}

const snooplog = console.log
console.log = function(){}
let db_obj = require('./dbwrapper')
let snoopdog = new db_obj
//depois tem que mudar a linha abaixo para permitir mais tipos de teste
const voa = assertions['vigenciaOptionsArray']
let globerror = false, error, errormsg = '', auxresp
voa.forEach((e,i,a) => {
	error = false
	auxresp = snoopdog.vigenciaOptionsArray(e.id)
	if(auxresp.length != e.expected.length) {
		snooplog('\x1b[31mdiscrepância entre número de respostas e asserções\x1b[0m')
		process.exit(1)		
	}
	auxresp.sort(ordenacao)
	e.expected.sort(ordenacao)
	snooplog("testando as asserções para a data \x1b[33m"+e.id+"\x1b[0m: \n")
	auxresp.forEach((el,ind,arr) => {
		if(el.id != e.expected[ind]){
			globerror = true
			error = true
			snooplog("\t\x1b[31mresultado esperado: "+el.id+"\t\x1b[0m")
			snooplog("\t\x1b[31mresultado retornado: "+e.expected[ind]+"\t\x1b[0m\n")
		}
	})
	if(!error){
		snooplog("\t\x1b[32mtodas as asserções passaram!\t\x1b[0m\n")
	}

})

console.log = snooplog
if(globerror) process.exit(1)
else process.exit(0)
