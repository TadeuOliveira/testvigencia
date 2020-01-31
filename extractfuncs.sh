if [[ ! -e dbwrapper.js ]]; then
	cp olddbwrapper.js dbwrapper.js
fi
sed -i -e 's/dbwrapper.getInstance()/this/g' dbwrapper.js
egrep -q 'this\.getSeletedContractType\(\)' dbwrapper.js
if [[ $? -eq 0 ]]; then
	echo -en "\nparece que seu script leva em conta o tipo de contratação.\nInsira-o aqui: "
	read tipocont
	sed -i -e "s/this\.getSeletedContractType()/\"$tipocont\"/g" dbwrapper.js
fi
egrep -q 'this\.getCNPJOperadora\(proposta\.getInstance\(\)\.btxplan\)' dbwrapper.js
if [[ $? -eq 0 ]]; then
	echo -en "\nparece que você importou uma administradora.\nInsira uma operadora dela aqui: "
	read tipoop
	sed -i -e "s/this.getCNPJOperadora(proposta.getInstance().btxplan)/\"$tipoop\"/g" dbwrapper.js
fi

sed -i -e 's/ extends obj_DBwrapper //g' dbwrapper.js
sed -i -e 's/super()/\/\/super()/g' dbwrapper.js
echo -e "\nmodule.exports = obj_DBwrapperCustom" >> dbwrapper.js
