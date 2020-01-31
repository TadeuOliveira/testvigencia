// DEMO

//==============================================================================
/**
 * Summary. (use period)
 *
 */
class obj_DBwrapperCustom {
	constructor() {		
		//super()
		console.log(this.constructor.name);
		this.areadepreco = 0;
	}


	/**
	 * Calcula vigencia.
	 * 
	 * @author Tadeu Oliveira <tadeu@planium.io>
	 * @param {string} isodate - Data de referencia em formato ISO 8601 (yyyy-mm-dd).
	 * @return {string} data de vigencia em formato ISO 8601.
	 */
	vigenciaOptionsArray(isodate) {
		let cnpjOperadora = "12682451000135"
		/**
		*
		* vigenciasGrupo armazena a relacao de fechamento e vigencia, de forma que:
		* entre o dia A do mes X ate o dia B do mes Y, o contrato entre em vigencia no dia
		* C do mes Z.
		* o dia B eh o dia representado na chave "fechamento".
		* o dia C eh o dia representado na chave "vigencia".
		* a relacao entre os valores desconhecidos sera explicada mais a frente
		*/
		let vigenciasGrupo = [
			{
				nome: 'premium',
				cnpj: '12682451000135',
				regras: [
					{
						fechamento: 21,
						vigencia: 1
					},
					{
						fechamento: 30,
						vigencia: 10
					},
					{
						fechamento: 10,
						vigencia: 20
					}
				]
			},
			{
				nome: 'unimed',
				cnpj: '16513178000176',
				regras: [
					{
						fechamento: 20,
						vigencia: 1
					},
					{
						fechamento: 30,
						vigencia: 10
					}
				]
			},
			{
				nome: 'medgold',
				cnpj: '14576780000127',
				regras: [
					{
						fechamento: 20,
						vigencia: 1
					}
				]
			},
			{
				nome: 'vitallis',
				cnpj: '62550256001606',
				regras: [
					{
						fechamento: 20,
						vigencia: 1
					}
				]
			},
			{
				nome: 'casseb',
				cnpj: '13373539000138',
				regras: [
					{
						fechamento: 15,
						vigencia: 1
					},
					{
						fechamento: 30,
						vigencia: 15
					}
				]
			},
			{
				nome: 'medvida',
				cnpj: '00303696000125',
				regras: [
					{
						fechamento: 15,
						vigencia: 1
					},
					{
						fechamento: 30,
						vigencia: 15
					}
				]
			},
			{
				nome: 'boasaude',
				cnpj: '11076382000153',
				regras: [
					{
						fechamento: 25,
						vigencia: 5
					},
					{
						fechamento: 5,
						vigencia: 15
					},
					{
						fechamento: 20,
						vigencia: 25
					}
				]
			},
			{
				nome: 'uniaomedica',
				cnpj: '04745753000187',
				regras: [
					{
						fechamento: 15,
						vigencia: 1
					},
					{
						fechamento: 30,
						vigencia: 15
					}
				]
			}
		]
		/**
		* vigenciaConfig filtra a operadora do plano escolhido e
		* armazena as regras especificas desta operadora
		*/
		let vigenciaConfig
		let vigenciaInfos = vigenciasGrupo.find(e => e.cnpj === cnpjOperadora)
		if(vigenciaInfos === undefined){
			console.error('cnpj não encontrado')
			return
		}
		else {
			vigenciaConfig = vigenciaInfos.regras
		}

		console.log(vigenciaConfig)

		/**
		* funcao auxiliar para converter o
		* valor recebido por um objeto Date para uma data legivel.
		* Importante apontar que o mes eh incrementado pois a
		* contagem de meses no objeto de Date se inicia em 0, enquanto
		* a representacao humana parte de 1.
		*/
		var formatDate = (d,m,y) => {
			m++
			d = d < 10 ? "0"+d : d
			m = m < 10 ? "0"+m : m
			return {dia:d,mes:m,ano:y}
		}

		/**
		* Funcao auxiliar para simplesmente indicar se 
		* x esta dentro de um determinado intervalo.
		*/
		var noIntervalo = (x,min,max) => x >= min && x <= max

		/**
		* Ordenando o array de vigenciaConfig por dia de fechamento.
		* A importancia disto sera explicada a seguir.
		*/
		vigenciaConfig.sort((a,b) => {
			return (a.fechamento > b.fechamento) ? 1 : -1
		})

		/**
		* Para explicar o resto do codigo, sera necessario explicitar a
		* relacao entre as outras variaveis apresentadas no comentario de vigenciaGrupo:
		* Se C <= B, o algoritmo infere que Z > Y (mais especificamente: Z = Y + 1).
		* Se C > B, o algoritmo infere que Z = Y.
		* Os valores de A serao armazenados em minFech.
		* Seu calculo eh simplesmente o valor do fechamento anterior acrescido de 1.
		* No caso de nao haver fechamento anterior, seu valor eh simplesmente 1.
		*/
		var minFech = new Array()

		console.log(vigenciaConfig)

		vigenciaConfig.forEach((x,i,a) => {
			minFech[i] = i == 0 ? 1 : a[i-1].fechamento + 1
		})

		console.log(minFech)

		/**
		*
		* intervaloParaProposta armazena os valores A, B e C mencionados ao longo
		* destes comentarios, pelas chaves minFech, maxFech e vigencia, respectivamente.
		*/
		var intervaloParaProposta = new Array()

		vigenciaConfig.forEach((x,i,a) => {
			intervaloParaProposta[i] = {
				'minFech': minFech[i],
				'maxFech': vigenciaConfig[i].fechamento,
				'vigencia': vigenciaConfig[i].vigencia
			}
		})

		/**
		*
		* eventualmente os limites das vigencias nao ira ate o dia 31, pelo
		* simples fato de que nem todos os meses tem 31 dias.
		* neste caso, os dias nao abrangidos nao estariam mapeados para
		* uma vigencia.
		* Isto eh feito, portanto, neste ultimo tratamento, adicionando os
		* dias restantes que podem haver por mes para a primeira regra de vigencia.
		* Isto eh, a regra que abrange o dia 1.
		*/
		if(vigenciaConfig[vigenciaConfig.length-1].fechamento < 31) {
			intervaloParaProposta[vigenciaConfig.length] = {
				'minFech': vigenciaConfig[vigenciaConfig.length-1].fechamento + 1,
				'maxFech': 31,
				'vigencia': vigenciaConfig[0].vigencia
			}
		}

		console.log(intervaloParaProposta)

		/**
		*
		* com a variavel intervaloParaProposta configurada, o algoritmo
		* pode comecar a ler as informacoes da data atual para definir a
		* regra de vigencia contemplada por esta.
		* O acrescimo de T00:00:00 se justifica pela nao especificacao do
		* timezone, o que faz a isodate eventualmente se converter no dia anterior.
		* vigenciaDia e acrescentaMeses sao inicializadas com valores default.
		*/
		let thisDate = new Date(isodate+'T00:00:00')
		var diaAtual = thisDate.getDate()
		var mesAtual = thisDate.getMonth()+1
		var anoAtual = thisDate.getFullYear()
		var vigenciaDia = -1
		var acrescentaMes = false

		console.log("dia de data teste: " + diaAtual)
		console.log("mês de data teste: " + mesAtual)

		/**
		* auxUmaVigencia corrige uma imprecisao que ocorre quando
		* ha apenas uma regra de vigencia na operadora.
		*/
		var auxUmaVigencia

		/**
		*
		* Aqui, eh feito um loop em intervaloParaProposta para
		* definir qual a regra de vigencia deve ser contemplada para
		* o dia em que o algoritmo eh chamado.
		* Para definir Z, a variavel acrescentaMes eh definida, de forma que:
		* caso true, Z++
		*/
		intervaloParaProposta.forEach((x,i,a) => {
			if(noIntervalo(diaAtual,a[i].minFech,a[i].maxFech)){
				//console.log('valor do i: ' + i)
				vigenciaDia = a[i].vigencia
				acrescentaMes = (a[i].vigencia >= a[i].maxFech && i !== a.length) ? false : true
				auxUmaVigencia = a[i].maxFech
			}
		})

		/**
		* ajustando mes e formatando vigencia encontrada para ser armazenada
		* em answer
		*/
		console.log("acrescentaMes "+ acrescentaMes)
		let vigenciaMes = acrescentaMes ? ++mesAtual : mesAtual
		var vigenciaAno = anoAtual
		if(auxUmaVigencia && auxUmaVigencia === 31) vigenciaMes++
		if(vigenciaMes > 12){
			vigenciaMes -= 12
			mesAtual -= 11
			vigenciaAno++
		}

		console.log("dia vigência: " + vigenciaDia)
		console.log("mês vigência: " + vigenciaMes)
		console.log("ano vigência: " + vigenciaAno)

		if(mesAtual < 10) mesAtual = "0" + mesAtual
		if(diaAtual < 10) diaAtual = "0" + diaAtual
		if(vigenciaMes < 10) vigenciaMes = "0" + vigenciaMes
		if(vigenciaDia < 10) vigenciaDia = "0" + vigenciaDia

		var answer = [
			{
				label: vigenciaDia + "/" + vigenciaMes + "/" + vigenciaAno,
				id: vigenciaAno + "-" + vigenciaMes + "-" + vigenciaDia
			}
		]

		/**
		*
		* A partir deste ponto, as proximas vigencias sao encontradas a partir
		* da primeira vigencia encontrada, que foi a minima.
		* A funcao nextDate eh uma funcao auxiliar para fazer este passo para
		* cada nova vigencia a ser encontrada.
		* Basicamente, ela olha para o valor arr[i-1].vigencia e ve se eh menor ou maior/igual
		* do que arr[i].vigencia. 
		* No segundo caso, o mes eh acrescido.
		* Os varios operadores % se justificam pelo fato de que
		* i pode ultrapassar o tamanho do array (isto nao eh controlado no loop).
		* Tambem e tomado cuidado no indice do valor atual para nao ser menor do que 0

		*/
		let nextDate = (arr,i,m,y) => {
		 	if(arr[i%arr.length].vigencia <= arr[(i+(arr.length-1))%arr.length].vigencia) { 
		 		return new Date(y,m+1,arr[i%arr.length].vigencia) 
		 	} 
		 	else { 
		 		return new Date(y,m,arr[i%arr.length].vigencia)
		 	}
		}
		/**
		* como a ultima regra de vigencia foi criada artificialmente para
		* contemplar o problema do dia atual ser maior do que a maior vigencia.
		* Ja que, a partir deste momento, este problema nao ocorre, este valor
		* artificial eh desligado do array para garantir haja exatamente uma
		* regra de vigencia por valor no array.
		* isto eh feito abaixo.
		*/
		intervaloParaProposta.pop()

		/**
		* k eh o indice da primeira regra de vigencia encontrada.
		* A partir deste valor, ele eh acrescido, funcionando como
		* um iterador em cima do intervaloParaProposta.
		*/
		let k = intervaloParaProposta.findIndex((e,i) => {
			if(e.vigencia == vigenciaDia) return true
			else return false
		})
		k++
		let auxMes = --vigenciaMes

		/**
		* O 6 se justifica pelo numero de valores a serem
		* acrescidos na lista de vigencias disponiveis.
		* A principio, esta hardcoded, mas pode ser editado.
		* Dentro do loop, eh pega a proxima vigencia e formatada para
		* ser inserida no formato de answer.
		*/
		for (var i = k; i < (k+6); i++) {
			let auxProximaData = nextDate(intervaloParaProposta,i,auxMes,vigenciaAno)
			auxMes = auxProximaData.getMonth()
			vigenciaAno = auxProximaData.getFullYear()
			let proxData = formatDate(auxProximaData.getDate(),auxProximaData.getMonth(),auxProximaData.getFullYear())
			answer.push({
				label: proxData.dia+"/"+proxData.mes+"/"+proxData.ano,
				id: proxData.ano+"-"+proxData.mes+"-"+proxData.dia
			})
		}

		/**
		* retorna a answer com o numero de vigencias desejado pelo cliente. Ta-da!
		* em caso de ainda haver duvida, pergunte ao author.
		*/
		return answer
	}
	
	computeVigencia(isodate) {
	//	let d = new Date(isodate+"T12:00:00");
		
		// assumindo que a vigencia sera 15 dias a frente
		//d.setDate(d.getDate() + 15);  
		let vigSelecionada = new Date(proposta.getInstance().vigencia_id).getTime()
		let hoje = new Date().toISOString().substr(0,10)
		let hojetimestamp = new Date().getTime()
		return hojetimestamp < vigSelecionada ? 
			proposta.getInstance().vigencia_id :
			this.vigenciaOptionsArray(hoje)[0].id;
	}

	getTaxaExtra(obj) {
		// pelo menos as seguintes propriedades tem que existir
		let reg_ans  = obj.reg_ans;
		let totbens  = obj.totbens;
		let entidade = obj.entidade;  // (CNPJ) pode ser null

		if (entidade == null){
			return 0.00
		}
		else{
			switch (entidade) {

				case "21178305000168":
					if (reg_ans == 474783156 || reg_ans == 464472117 || reg_ans == 464472117 || reg_ans == 481975186 || reg_ans == 481974188 || reg_ans == 481973180 || reg_ans == 481976184) {
						return 8.00;
					}

				case "18990845000137":
				case "04839487000151":
					if (reg_ans == 464472117 || reg_ans == 464472117 || reg_ans == 481975186 || reg_ans == 481974188 || reg_ans == 481973180 || reg_ans == 481976184) {
						return 3.00;
					}

				case "04839487000151":
					if (reg_ans == 47362158 || reg_ans == 473604154 || reg_ans == 481975186 || reg_ans == 473603156 || reg_ans == 482185198 || reg_ans == 482186196 || reg_ans == 465629116 || reg_ans == 475471169 || reg_ans == 475470161) {
						return 3.00;
					}

				case "00628869000185":
					return 4.00;

				case "18990845000137":
					if (reg_ans == 47362158 || reg_ans == 473604154 || reg_ans == 473601150 || reg_ans == 473603156 || reg_ans == 482185198 || reg_ans == 482186196 || reg_ans == 475471169 || reg_ans == 475470161) {
						return 4.00;
					}

				case "11312930000105":
					if (reg_ans == 482185198 || reg_ans == 482186196 ) {
						return 5.00;
					}
			}
		}

		return 0.0;
	}
	
	_listPlanCodes(uf,cidade) {
		if (!this.contract_type) {
			console.error(this.constructor.name,this._listPlanCodes.name,'NULL contract_type');
			return null;
		}
		if (this.contract_type != "pj") {
			return super._listPlanCodes(uf,cidade);
		}
		let cidades = this.data[this.contract_type].cidades;
		if (!cidades) {
			console.error(this.constructor.name,this._listPlanCodes.name,'NULL cidades');
			return [];
		}
		let res = [];
		for (let i = 0, len = cidades.length; i < len; i++) {
			if (cidades[i].uf === uf && cidades[i].cidade === cidade) {
				this.areadepreco = cidades[i].planos[0].areadepreco;
		
				res = res.concat(cidades[i].planos[0].btxplanos);
			} else if (cidades[i].uf === uf && cidades[i].cidade === '*') {
		
				res = res.concat(cidades[i].planos[0].btxplanos);
			} else if (cidades[i].uf === '*' && cidades[i].cidade === '*') {
				
				res = res.concat(cidades[i].planos[0].btxplanos);	
			}
		}
		
		res = btxLib.uniqueArray(res);
		
		return res;
	}
	
	getPriceForAge(obj) {
		console.log(this.constructor.name,this.getPriceForAge.name);
		// pelo menos as seguintes propriedades tem que existir
		let btxplano = parseInt(obj.btxplano);
		let totbens  = obj.totbens;
		let age      = obj.age;
		let entidade = obj.entidade;  // pode ser null
		let parentesco = obj.parentesco;  // pode ser null neste caso assume titular
		let meiflag  = obj.meiflag;   // pode ser null -  no caso de pj se existir é um boleano
		
		if (this.contract_type != "pj") {
			return super.getPriceForAge(obj);
		}
		
		console.log('plano',btxplano,'age',age,'totbens',totbens,'meiflag',meiflag);
		
		let vidas = (totbens < 30) ? 2 : 30;
		let mei = false;
		if (meiflag) {
			mei = meiflag;
		}
		
		let isodonto = false;
		let planos = this.data[this.contract_type].planos;
		for ( let i = 0; i < planos.length; i++ ) {
			if (planos[i].btxplano === btxplano && planos[i].segmentacao === "O") {
				isodonto = true;
				break;
			}
		}
		
		// se necessario deveria levar em consideracao totbens
		let precos = this.data[this.contract_type].precos;
		for ( let i = 0; i < precos.length; i++ ) {
			//console.log("checking",precos[i].btxplano,precos[i].vidas,precos[i].mei);
			if (precos[i].btxplano === btxplano ) {
				if (isodonto) {
					let price =  precos[i].preco[0];
					return price;
				} else {
					if (precos[i].vidas === vidas && precos[i].mei == mei) {
						//console.log("checking",precos[i].areadepreco,this.areadepreco);
						if (precos[i].areadepreco === this.areadepreco || precos[i].areadepreco === 4) {
							console.log("found match",precos[i].areadepreco);
							let ageindex = this._priceIndexForAge(age);
							let price =  precos[i].preco[ageindex];

							return price;
						}
					}
				}
			}
		}
		console.warn("PRICE NOT FOUND");
		return 0.0;
	}
	
    /**
     * computa o que for necessario quando a quantidade de beneficiarios muda
	 * exemplo: intermedica classifica area de preco em funcao do endereco da maioria
     * 
     * @param  {persons}          array de beneficiarios
	 * @return                   nothing
     */
	handleBeneficiariosChanged(persons) {
		console.log(this.constructor.name,this.handleBeneficiariosChanged.name);
		//this.areadepreco = 1;
		
	    let dictionary = [];
		for (let i = 0; i < persons.length; i++) {
			if (!(persons[i].tipo & obj_Person.tipoTitularMask)) {
				continue;
			}
			
			let uf   = persons[i].endereco1.uf;
			let cidade = persons[i].endereco1.cidade;
		
			let areadepreco = 0;
			let cidades = this.data[this.contract_type].cidades;
			for (let k = 0, len = cidades.length; k < len; k++) {
				if (cidades[k].uf === uf && cidades[k].cidade === cidade) {
					areadepreco = cidades[k].planos[0].areadepreco;
					break;
				}
			}
		
			//computa dependentes
			let vidas = 1;
			for (let k = 0; k < persons.length; k++) {
				if (persons[k].tipo & obj_Person.tipoDependenteMask) {
					if (persons[k].titular_uuid == persons[i].uuid) {
						vidas += 1;
					}
				}
			}
			
			if (dictionary[areadepreco]) {
				dictionary[areadepreco] += vidas;
			} else {
				dictionary[areadepreco] = vidas;
			}
		}
		
		let maxcount  = 0;
		let maxkey    = null;
		for (let key in dictionary) {
		  if (dictionary.hasOwnProperty(key)) {
			  console.log(this.handleBeneficiariosChanged.name,key,dictionary[key]);
			  if (dictionary[key] > maxcount) {
				  maxcount = dictionary[key];
				  maxkey   = key;
			  }
		  }
		}
		console.log(this.handleBeneficiariosChanged.name," MAIORIA ",maxkey,maxcount);
		
		let empate = [];
		for (let key in dictionary) {
		  if (dictionary.hasOwnProperty(key)) {
			  if (dictionary[key] == maxcount) {
				  empate.push(key);
			  }
		  }
		}
		
		let iret = 0;
		console.log(this.handleBeneficiariosChanged.name," EMPATES ",empate.length);
		if (empate.length > 1) {
			  // para desempate
		      // 1 SP capital
		      // 2 SP interior
		      // 3 RJ
			for (let i = 0; i < empate.length; i++) {
				if (iret == 0) {
					iret = empate[i];
				} else if (empate[i] < iret) {
					iret = empate[i];
				}
			}
		} else {
			iret = maxkey;
		}
		
		console.log(this.handleBeneficiariosChanged.name," AREA MAIORIA ",iret);
		this.areadepreco = parseInt(iret);
	}
	
	
    /**
     * calcula preco para um plano e uma idade
	 * este é o metodo que tem que ser "overridado" para cada operadora
	 * a implementaçao default esta comentada abaixo
     * 
     * @param {Object}  idades	 array com idades dos beneficiarios
	 * @return {float}           preco
     */
	/*
	
	getPriceForAge(obj) {
		// pelo menos as seguintes propriedades tem que existir
		let btxplano = obj.btxplano;
		let totbens  = obj.totbens;
		let age      = obj.age;
		let entidade = obj.entidade; // pode ser null
		
		// se necessario deveria levar em consideracao totbens
		let precos = this.data[this.contract_type].precos;
		for ( let i = 0; i < precos.length; i++ ) {
			if (entidade) {
	   			if (!precos[i].cnpjentidades.includes(entidade)) {
	   				continue;			
	   			}
			}
			if (precos[i].btxplano === btxplano) {
				let ageindex = this._priceIndexForAge(age);
				return precos[i].preco[ageindex];
			}
		}
		return 0.0;
	}
	*/

	getAcessoriosArray(odontoflag) {
		console.log(this.constructor.name,this.getAcessoriosArray.name,odontoflag);
		let res = [];
		if (this.data[this.contract_type].acessorios) {
			for (let i = 0; i < this.data[this.contract_type].acessorios.length; i++) {
				let produto = this.data[this.contract_type].acessorios[i].produto;
				let btxid = this.data[this.contract_type].acessorios[i].btxid;
				let btxplano = proposta.getInstance().btxplan;
				let cnpjOperadora = "12682451000135";
  				let reg_ans = 0;
				//let planos = this.data["ad"].planos;
				for(let j=0; j < this.data[this.contract_type].planos.length; j++){
					let test = this.data[this.contract_type].planos[j].btxplano;

					if (btxplano == this.data[this.contract_type].planos[j].btxplano){
						 reg_ans = this.data[this.contract_type].planos[j].registroans;
						
					} 
				}
					
				if ((btxid == 2 || btxid == 3 || btxid == 4) && cnpjOperadora == '16513178000176' && (reg_ans == 459579093 || reg_ans == 459619096 || reg_ans == 459576099 || reg_ans == 470353137 || reg_ans == 470354135)) {

					res.push(this.data[this.contract_type].acessorios[i]);
				} 
				else if ((btxid == 5 || btxid == 6 || btxid == 7) && cnpjOperadora == '16513178000176' && (reg_ans ==459430094 || reg_ans == 459826091 || reg_ans == 459443096 || reg_ans == 459445092 || reg_ans == 459579093)) {
					
					res.push(this.data[this.contract_type].acessorios[i]);
				}
			}
		}
		return res;
	}
	
	/**
	 * Calcula valor dos acessorios.
	 * 
	 * @param {array} acessorios 	- array de acessorios id.
	 * @param {int} numtitulares 	- total de titulares.
	 * @param {int} numdependentes 	- total de dependentes.
	 * @return {array} precos calculados ou null.
	 */
	getAcessoriosPrice(acessorios, numtitulares, numdependentes ) {
		let res = [];
		if (this.data[this.contract_type].acessorios) {
			for (let i = 0; i < this.data[this.contract_type].acessorios.length; i++) {
				let ac = this.data[this.contract_type].acessorios[i];
				if (acessorios.includes(ac.btxid)) {
					let obj = {};
					obj.btxid = ac.btxid;
					obj.descricao = ac.descricao;
					obj.beneficiarios = numtitulares + numdependentes;
					obj.valor = ac.valor;
					obj.valor_total = ac.valor * (numtitulares + numdependentes);
					res.push(obj);
				}
			}
		}
		if (res.length > 0)
			return res;
		return null;
	}
}




module.exports = obj_DBwrapperCustom
