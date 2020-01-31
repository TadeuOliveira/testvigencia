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
     * calcula preco para todos os planos fitrados
     * 
     * @param {array}  idades	 array com idades dos beneficiarios
     * @param {string} entidade  cnpj da entidade no caso de adesao
	 * @param {integer}  ccbtxid  btxid da condicao comercial
	 * @return {array}           com o valor calculado para cada plano filtrado
     */

	listFilteredPlansPrice(idades,entidade,ccbtxid) {
		console.log(this.constructor.name,this.listFilteredPlansPrice.name,idades,ccbtxid);
		let result = this.filteredplans;
		let products_senior = [];

		let idade_senior_flag = false;
		for ( let i in idades ) {
			if ( idades[i] > 59 ) {
				idade_senior_flag = true;
				break;
			}
		}

		console.log('idade_senior_flag', idade_senior_flag);
		let planos_senior = [473274150,473275158];
		for ( let i in result ) {

			let totprice = new Decimal('0');
			let obj = { btxplano: result[i].btxplano, totbens: idades.length, entidade: null, ccbtxid: ccbtxid };
			if (entidade)
				obj.entidade = entidade;
			
			
			for ( let k = 0; k < idades.length; k++ ) {
				obj.age = idades[k];
				let preco = this.getPriceForAge(obj);
				totprice = totprice.plus(preco);
			}
			
			result[i].preco   = totprice.toDecimalPlaces(2).toNumber();
			result[i].numbens = idades.length;

			if ( planos_senior.includes(result[i].registroans) && idade_senior_flag ) {
				products_senior.push(result[i]);
			}

		}
		
		products_senior.sort(function(a,b) {return (a.preco > b.preco) ? 1 : ((b.preco > a.preco) ? -1 : 0);} ); 
		result.sort(function(a,b) {return (a.preco > b.preco) ? 1 : ((b.preco > a.preco) ? -1 : 0);} ); 

		if ( idade_senior_flag )
			return products_senior;

		return result;
	}


	/**
	 * Calcula vigencia.
	 * 
	 * @param {string} isodate - Data de referencia em formato ISO 8601 (yyyy-mm-dd).
	 * @return {string} data de vigencia em formato ISO 8601.
	 */
	
	computeVigencia(isodate) {
		let d = new Date(isodate+"T12:00:00");
		
		// assumindo que a vigencia sera 15 dias a frente
		d.setDate(d.getDate() + 15);  
		
		return d.toISOString().slice(0, 10);
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
