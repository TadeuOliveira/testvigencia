
//==============================================================================
/**
 * Summary. (use period)
 *
 */
class obj_DBwrapperCustom {
	constructor() {
		//super()
		console.log(this.constructor.name);
	}




	/**
	 * Retorna array com opcoes de vigencia.
	 *
	 * @param {string} isodate - Data de referencia em formato ISO 8601 (yyyy-mm-dd).
	 * @return {array} opcoes de escolha array de  {label:xxx,id:yyy} .
	 *
	 *  na grande maioria dos casos label sera a data BR e neste caso id deve ser data ISO
	 *  opren para ficar flexivel label e id pode ser qualquer coisa
	 *
	 */
	/*vigenciaOptionsArray(isodate) {
		let cnpjOperadora = "nao"
		let vigenciasGrupo = [
			{
				nome: 'gndi',
				cnpj: '44649812000138',
				regras: [
					{
						fechamento: 24,
						vigencia: 1
					},
					{
						fechamento: 3,
						vigencia: 10
					},
					{
						fechamento: 11,
						vigencia: 20
					}
				]
			},
			{
				nome: 'saocristovao',
				cnpj: '60975174000100',
				regras: [
					{
						fechamento: 24,
						vigencia: 1
					},
					{
						fechamento: 7,
						vigencia: 15
					}
				]
			},
			{
				nome: 'ameplan',
				cnpj: '67839969000121',
				regras: [
					{
						fechamento: 24,
						vigencia: 1
					},
					{
						fechamento: 7,
						vigencia: 15
					}
				]
			},
			{
				nome: 'plena',
				cnpj: '00338763000147',
				regras: [
					{
						fechamento: 11,
						vigencia: 1
					},
					{
						fechamento: 3,
						vigencia: 15
					}
				]
			},
			{
				nome: 'plasmec',
				cnpj: '19512026000147',
				regras: [
					{
						fechamento: 28,
						vigencia: 1
					},
					{
						fechamento: 8,
						vigencia: 15
					}
				]
			},
			{
				nome: 'garantia',
				cnpj: '45572583000163',
				regras: [
					{
						fechamento: 24,
						vigencia: 1
					},
					{
						fechamento: 7,
						vigencia: 15
					}
				]
			},
			{
				nome: 'biovida',
				cnpj: '04299138000194',
				regras: [
					{
						fechamento: 11,
						vigencia: 1
					},
					{
						fechamento: 3,
						vigencia: 15
					}
				]
			},
			{
				nome: 'classes',
				cnpj: '61740791000180',
				regras: [
					{
						fechamento: 24,
						vigencia: 1
					},
					{
						fechamento: 7,
						vigencia: 15
					}
				]
			},
			{
				nome: 'unimedseguros',
				cnpj: '04487255000181',
				regras: [
					{
						fechamento: 21,
						vigencia: 1
					}
				]
			},
			{
				nome: 'unihosp',
				cnpj: '01445199000124',
				regras: [
					{
						fechamento: 11,
						vigencia: 1
					},
					{
						fechamento: 3,
						vigencia: 15
					}
				]
			},
			{
				nome: 'scmaua',
				cnpj: '08225953000160',
				regras: [
					{
						fechamento: 11,
						vigencia: 1
					},
					{
						fechamento: 3,
						vigencia: 15
					}
				]
			}
		]
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

		var formatDate = (d,m,y) => {
			m++
			d = d < 10 ? "0"+d : d
			m = m < 10 ? "0"+m : m
			return {dia:d,mes:m,ano:y}
		}

		var noIntervalo = (x,min,max) => x >= min && x <= max

		vigenciaConfig.sort((a,b) => {
			return (a.fechamento > b.fechamento) ? 1 : -1
		})

		var minFech = new Array()

		console.log(vigenciaConfig)

		vigenciaConfig.forEach((x,i,a) => {
			minFech[i] = i == 0 ? 1 : a[i-1].fechamento + 1
		})

		console.log(minFech)

		var intervaloParaProposta = new Array()

		vigenciaConfig.forEach((x,i,a) => {
			intervaloParaProposta[i] = {
				'minFech': minFech[i],
				'maxFech': vigenciaConfig[i].fechamento,
				'vigencia': vigenciaConfig[i].vigencia
			}
		})

		if(vigenciaConfig[vigenciaConfig.length-1].fechamento < 31) {
			intervaloParaProposta[vigenciaConfig.length] = {
				'minFech': vigenciaConfig[vigenciaConfig.length-1].fechamento + 1,
				'maxFech': 31,
				'vigencia': vigenciaConfig[0].vigencia
			}
		}

		console.log(intervaloParaProposta)

		let thisDate = new Date(isodate+'T00:00:00')
		console.log("dia de data: " + thisDate)
		var diaAtual = thisDate.getDate()
		var mesAtual = thisDate.getMonth()+1
		var anoAtual = thisDate.getFullYear()
		var vigenciaDia = -1
		var acrescentaMes = false

		console.log("dia de data teste: " + diaAtual)
		console.log("mês de data teste: " + mesAtual)
		var auxUmaVigencia

		intervaloParaProposta.forEach((x,i,a) => {
			if(noIntervalo(diaAtual,a[i].minFech,a[i].maxFech)){
				//console.log('valor do i: ' + i)
				vigenciaDia = a[i].vigencia
				acrescentaMes = (a[i].vigencia >= a[i].maxFech && i !== a.length) ? false : true
				auxUmaVigencia = a[i].maxFech
			}
		})

		console.log("acrescentaMes "+ acrescentaMes)
		let vigenciaMes = acrescentaMes ? ++mesAtual : mesAtual
		var vigenciaAno = anoAtual
		//if(auxUmaVigencia && auxUmaVigencia === 31) vigenciaMes++
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

		console.log(answer);

		let nextDate = (arr,i,m,y) => {
		 	if(arr[i%arr.length].vigencia <= arr[(i+(arr.length-1))%arr.length].vigencia) { 
		 		return new Date(y,m+1,arr[i%arr.length].vigencia) 
		 	} 
		 	else { 
		 		return new Date(y,m,arr[i%arr.length].vigencia)
		 	}
		}
		intervaloParaProposta.pop()
		let k = intervaloParaProposta.findIndex((e,i) => {
			if(e.vigencia == vigenciaDia) return true
			else return false
		})
		k++
		let auxMes = --vigenciaMes
		let i = k;
		var diffDays = 0;
		// FIX PLENA UNIHOSP
		if ( cnpjOperadora == '00338763000147' || cnpjOperadora == '01445199000124' ) {
			console.log('estou dentro da condicao plena unihosp ;)');
			while( diffDays <= 49 ) {

				let auxProximaData = nextDate(intervaloParaProposta,i,auxMes,vigenciaAno)
				vigenciaAno = auxProximaData.getFullYear()
				auxMes = auxProximaData.getMonth()
				let proxData = formatDate(auxProximaData.getDate(),auxProximaData.getMonth(),auxProximaData.getFullYear())
				var proxVig  = new Date(proxData.ano+"-"+proxData.mes+"-"+proxData.dia+'T00:00:00');
				console.log('>>>>>>>> '+proxVig+' <<<<<<<');
				var dataHoje = new Date();
				console.log('>>>>>>>> '+dataHoje+' <<<<<<<');
				var timeDiff = proxVig.getTime() - dataHoje.getTime();
				diffDays = timeDiff / (1000 * 3600 * 24);
				console.log(' diffDays ----------------> '+diffDays);
				if ( diffDays <= 49 ) {
					
					answer.push({
						label: proxData.dia+"/"+proxData.mes+"/"+proxData.ano,
						id: proxData.ano+"-"+proxData.mes+"-"+proxData.dia
					})
				}
				i++

			};
		} else {

			while( diffDays <= 45 ) {

				let auxProximaData = nextDate(intervaloParaProposta,i,auxMes,vigenciaAno)
				vigenciaAno = auxProximaData.getFullYear()
				auxMes = auxProximaData.getMonth()
				let proxData = formatDate(auxProximaData.getDate(),auxProximaData.getMonth(),auxProximaData.getFullYear())
				var proxVig  = new Date(proxData.ano+"-"+proxData.mes+"-"+proxData.dia+'T00:00:00');
				console.log('>>>>>>>> '+proxVig+' <<<<<<<');
				var dataHoje = new Date();
				console.log('>>>>>>>> '+dataHoje+' <<<<<<<');
				var timeDiff = proxVig.getTime() - dataHoje.getTime();
				diffDays = timeDiff / (1000 * 3600 * 24);
				console.log(' diffDays ----------------> '+diffDays);
				if ( diffDays <= 45 ) {
					answer.push({
						label: proxData.dia+"/"+proxData.mes+"/"+proxData.ano,
						id: proxData.ano+"-"+proxData.mes+"-"+proxData.dia
					})
				}
				i++

			};
		}

		//return [{label:"01/05/2019",id:"2019-05-01"},{label:"11/05/2019",id:"2019-05-11"}]
		return answer
	}*/





	sumDigit(n) {
		return n > 9 ? "" + n : "0" + n;
	}

	computeVigencia(isodate) {
		let d = new Date(isodate+"T12:00:00");
		console.log("dia de data: " + d);
		let diaAtual = d.getDate();
		let mesAtual = d.getMonth()+1;
		let anoAtual = d.getFullYear();
		
		let cnpjOperadora = "nao";

		if ( cnpjOperadora == '22694698000125' ) {

			if ( diaAtual >= 1 && diaAtual <= 15 ) {

				d.setDate(1); 
				d.setMonth(mesAtual); 
			} else {

				d.setDate(15);
				d.setMonth(mesAtual);
			}
		}

		if ( cnpjOperadora == '27047334000177' ) {

			if ( diaAtual >= 11 && diaAtual <= 31 ) {

				d.setDate(10);
				d.setMonth(mesAtual);  
			} else {

				d.setDate(20);
				d.setMonth(mesAtual-1);
			}

		} 

		if ( cnpjOperadora == '01518211000183' ) {

			if ( diaAtual >= 1 && diaAtual <= 10 ) {

				d.setDate(1); 
				d.setMonth(mesAtual); 
			} else if ( diaAtual >= 11 && diaAtual <= 20 ) {

				d.setDate(10);
				d.setMonth(mesAtual);
			} else {

				d.setDate(20);
				d.setMonth(mesAtual);
			}
		}
		
		return d.toISOString().slice(0, 10);
	};

	/*getTaxaExtra(obj) {
		// pelo menos as seguintes propriedades tem que existir
		let btxplano = obj.btxplano;
		let totbens  = obj.totbens;
		let entidade = obj.entidade;  // (CNPJ) pode ser null

		let vigencia = new Date(this.vigenciaOptionsArray(isodate)[0].id+'T00:00:00');
		let vigencia_dia = vigencia.getDate();
		let vigencia_mes = vigencia.getMonth()+1;
		let vigencia_ano = vigencia.getFullYear();

		if (entidade == null){
			return 0.00
		}
		else{
			switch (entidade) {
				case "04523073000119":
				case "47176656000123":
				case "11654345000185":
					return 2.00;

				case "05461620000141":
				case "44644854000186":
				case "29262342000161":
				case "02713525000108":
				case "05746803000103":
					return 3.00;

				case "31846611000189":
				case "13259440000100":
					return 3.50;

				case "24406622000182":
					return 4.50;

				case "09020431000194":
				case "25164035000197":
				case "10225903000124":
				case "21137086000179":
				case "09587682000155":
				case "07441543000193":
					return 5.00;

				case "02907471000103":
					if ( vigencia_dia == 20 && vigencia_mes == 1 && vigencia_ano == 2020 ) {

						return 7.00;
					} else if ( vigencia_mes > 1 && vigencia_ano == 2020 ) {

						return 7.00;
					} else {

						return 5.00;
					}

				case "07346925000138":
				case "28708576001107":
				case "49644594000162":
				case "45877305000114":
				case "33452400000278":
				case "68487784000168":
				
					return 0.0;

				case "04536296000110":
				
					return 20.00;
			}
		}

		return 0.0;
	}*/

}

module.exports = obj_DBwrapperCustom
