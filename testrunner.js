let alias = {
	voa: 'vigenciaOptionsArray',
	cv: 'computeVigencia'
}	
const getRespostas = {
	vigenciaOptionsArray: (arr,isodate) => { return arr.vigenciaOptionsArray(isodate)},
	computeVigencia: (arr,isodate) => { return arr.computeVigencia(isodate)},
}

const snooplog = console.log
console.log = function(){}
let db_obj = require('./dbwrapper')
let snoopdog = new db_obj
let all_assertions = require('./assertions/assertions')
const ordenacao = (a,b) => {
	if(a.hasOwnProperty('id')){
		return new Date(a.id) - new Date(b.id)
	}
	return new Date(a) - new Date(b)	
}

if(process.argv.length < 3){
	console.log('por favor, coloque como argumento o tipo de teste desejado')	
	process.exit(1)
}
const arg = alias.hasOwnProperty(process.argv[2]) ? 
	alias[process.argv[2]] :
	process.argv[2]
if(!all_assertions.hasOwnProperty(arg)){
	snooplog('\x1b[31mtipo de teste não encontrado\x1b[0m')
	process.exit(1)
} 
const assertions = all_assertions[arg]
//depois tem que mudar a linha abaixo para permitir mais tipos de teste
let globerror = false, error, errormsg = '', auxresp
assertions.forEach((e,i,a) => {
	error = false
	auxresp = getRespostas[arg](snoopdog,e.id)
	if(auxresp.length != e.expected.length) {
		snooplog('\x1b[31mdiscrepância entre número de respostas e asserções\x1b[0m')
		process.exit(1)		
	}
	if(arg == 'vigenciaOptionsArray') {
		auxresp.sort(ordenacao)
		e.expected.sort(ordenacao)
		snooplog("testando as asserções para a data \x1b[33m"+e.id+"\x1b[0m: \n")
		auxresp.forEach((el,ind,arr) => {
			if(el.id != e.expected[ind]){
				globerror = true
				error = true
				snooplog("\t\x1b[31mresultado esperado: "+e.expected[ind]+"\t\x1b[0m")
				snooplog("\t\x1b[31mresultado retornado: "+el.id+"\t\x1b[0m\n")
			}
		})
		if(!error){
			snooplog("\t\x1b[32mtodas as asserções passaram!\t\x1b[0m\n")
		}
	}
	else if(arg == 'computeVigencia'){
		if(e.expected == auxresp){
			snooplog("\t\x1b[32masserção válida para " + e.id + " -> " + auxresp + "!\t\x1b[0m\n")
		}
		else {
			snooplog("\t\x1b[33masserção inválida para " + e.id + "!\t\x1b[0m\n")
			snooplog("\t\x1b[31mresultado esperado: "+e.expected+"\t\x1b[0m")
			snooplog("\t\x1b[31mresultado retornado: "+auxresp+"\t\x1b[0m\n")
		}
	}
})

console.log = snooplog
if(globerror) process.exit(1)
else process.exit(0)
