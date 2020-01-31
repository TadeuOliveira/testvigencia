//==============================================================================
/**
 * Summary. (use period)
 *
 */
class obj_DBwrapperCustom  extends obj_DBwrapper {
    constructor() {     
        super()
        console.log(this.constructor.name);
    }


    computeVigencia() {
        console.log('computeVigencia.');

        let cnpjoperadora = dbwrapper.getInstance().getCNPJOperadora(proposta.getInstance().btxplan);

        let assinatura = new Date();
        let mes = assinatura.getMonth() +1;
        let day = assinatura.getDate();


        console.log(cnpjoperadora);

        // IDEAL SAÚDE
        if ( cnpjoperadora === '26032244000140' ) {

            if ( day >= 1 && day <= 31 ) {
                if( (mes+1) < 10 ) {
                    mes = "0" + (mes+1);

                    return assinatura.getFullYear() + '/' + mes + '/01';
                }

                return assinatura.getFullYear() + '/' + (mes+1) + '/01';

            } 
            else {
                if( (mes+1) < 10 ) {
                    mes = "0" + (mes+1);
                }
                let mesfinal = (mes +1 > 12) ? '01' : (mes +1);
                let anofinal = (mes +1 > 12) ? (assinatura.getFullYear() +1) : assinatura.getFullYear();

                return anofinal + '/' + mesfinal + '/01';
            }

        }



        // PLAN SAÚDE
        if ( cnpjoperadora === '03897847000109' ) {
            if ( day <= 15 ) {

                if( (mes+1) < 10 ) {
                    mes = "0" + (mes+1);

                    return assinatura.getFullYear() + '/' + (mes) + '/01';
                }

                return assinatura.getFullYear() + '/' + (mes+1) + '/01';

            } else if ( day <= 31 ) {

                if( (mes) < 10 ) {
                    mes = "0" + (mes+1);

                    return assinatura.getFullYear() + '/' + (mes) + '/15';
                }

                return  assinatura.getFullYear() + '/' + (mes+1) + '/15';
            }
            else {
                if( (mes+1) < 10 ) {
                    mes = "0" + (mes+1);
                }

                let mesfinal = (mes +1 > 12) ? '01' : (mes +1);
                let anofinal = (mes +1 > 12) ? (assinatura.getFullYear() +1) : assinatura.getFullYear();

                return anofinal + '/' + mesfinal + '/01';
            }
        }

        // ODONTOGROUP
        if ( cnpjoperadora === '02751464000165' ) {
            if ( day >= 1 && day <= 31 ) {

                if( (mes+1) < 10 ) {
                    mes = "0" + (mes+1);

                    return assinatura.getFullYear() + '/' + (mes) + '/01';
                }

                return assinatura.getFullYear() + '/' + (mes+1) + '/01';
            } else {

                if( (mes+1) < 10 ) {
                    mes = "0" + (mes+1);
                }

                mesfinal = (mes +1 > 12) ? '01' : (mes +1);
                anofinal = (mes +1 > 12) ? (assinatura.getFullYear() +1) : assinatura.getFullYear();

                return anofinal + '/' + mesfinal + '/01';
            }

            console.warn("OPERADORA PARA VIGÊNCIA NÃO ENCONTRADA");
            return null;
        }
    }
    
    
    /**
     * calcula preco para um plano e uma idade
     * este é o metodo que tem que ser "overridado" para cada operadora
     * a implementaçao default esta comentada abaixo
     * 
     * @param {Object}  idades   array com idades dos beneficiarios
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
}
