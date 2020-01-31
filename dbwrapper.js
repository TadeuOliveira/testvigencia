
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
     * calcula preco para um plano e uma idade
	 * este é o metodo que tem que ser "overridado" para cada operadora
     *
     * @param {Object}           objeto com dados do plano, idade ....
	 * @return {float}           preco
     */

	getPriceForAge(obj) {
		// pelo menos as seguintes propriedades tem que existir
		let btxplano = obj.btxplano;
		let totbens  = obj.totbens;
		let age      = obj.age;
		let entidade = obj.entidade;  // pode ser null
		let desconto = obj.desconto;  // pode ser null or 0

		// array of all price tables available
		let pricetables = [];

		let precos = this.data[this.contract_type].precos;
		for ( let i = 0; i < precos.length; i++ ) {
			if (entidade) {
	   			if (!precos[i].cnpjentidades.includes(entidade)) {
	   				continue;
	   			}
			}

			if (precos[i].btxplano === btxplano) {
				pricetables.push(precos[i]);
				//let ageindex = this._priceIndexForAge(age);
				//return precos[i].preco[ageindex];
			}
		}

		// sort by minvidas
		pricetables.sort(function(a, b) {
			return b.minvidas - a.minvidas;
		});
		console.log(pricetables);

		for ( let i = 0; i < pricetables.length; i++ ) {
			if (totbens >= pricetables[i].minvidas) {
				let ageindex = this._priceIndexForAge(age);
				let price = pricetables[i].preco[ageindex];
				if (desconto && desconto > 0) {
					desconto = (100.0-desconto)/100.0;
					let tmp = new Decimal(price);
					tmp = tmp.mul(desconto);
					price = tmp.toNumber();
				}
				return price;
			}
		}
		return 0.0;
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
	vigenciaOptionsArray(isodate) {

		Date.prototype.addDays = function(days) {
		    var date = new Date(this.valueOf());
		    date.setDate(date.getDate() + days);
		    return date;
		}

		let tipo_contrato = "ad";
		console.log(tipo_contrato);
		let date1 = new Date();
		let date2 = new Date(); // hoje


	


		let vigenciaConfig ={
			 pj: {
			 	mindays: 0,
				maxdays: 45,
				dias: [5,10,15,25]
			},
			pf :{
				mindays: 0,
				maxdays: 45,
				dias: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
			}
		};

		let vigencia_tipo ={
			"pj":vigenciaConfig.pj,
			"pf":vigenciaConfig.pf

		};

		let vigencia_uso = vigencia_tipo[tipo_contrato];


		let aux = [];

	 	if ( vigencia_uso === null ) {
			console.error('regra de vigencia nao definida ' );
		} else if ( vigencia_uso.dias.indexOf('*') === -1 ) {

			for ( let i = vigencia_uso.mindays; i <= vigencia_uso.maxdays; i++ ) {
				let tmp = date2.addDays(i);
				let tmpdate = tmp.getDate();
				let tmpmonth = (tmp.getMonth() + 1);

					console.log(tmpdate);
				if ( vigencia_uso.dias.indexOf(tmpdate) > -1 ) {
					console.log(tmpdate);
					if ( tmpdate < 10 ) tmpdate = '0' + tmpdate; // warning -- transform to string
					if ( tmpmonth < 10 ) tmpmonth = '0'+ tmpmonth; // warning -- transform to string

					aux.push({label: tmpdate + '/' + tmpmonth + '/' + tmp.getFullYear(), id: tmp.getFullYear() + '-' + tmpmonth + '-' + tmpdate });
				}

			}

		}

				
		//return [{label:"01/05/2019",id:"2019-05-01"},{label:"11/05/2019",id:"2019-05-11"}];
		return aux;
	}



	/**
	 * Calcula vigencia.
	 *
	 * @param {string} isodate - Data de referencia em formato ISO 8601 (yyyy-mm-dd).
	 * @return {string} data de vigencia em formato ISO 8601.
	 */
	computeVigencia(isodate) {
		console.log('computeVigencia.');
		
		return proposta.getInstance().vigencia_id;
	}

	/*
	 * retorna taxa extra (ilegal) se houver
	 *
	 * @param  {Object}          objeto com dados do plano, total beneficiarios ....
 	 * @return {float}           preco
	*/
	 /*getTaxaExtra(obj) {
		 // pelo menos as seguintes propriedades tem que existir
		 let btxplano = obj.btxplano;
		 let totbens  = obj.totbens;
		 let entidade = obj.entidade;  // (CNPJ) pode ser null

		 return 1.0;
	 }
	*/

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
