cp olddbwrapper.js dbwrapper.js
sed -i -e 's/dbwrapper.getInstance()/this/g' dbwrapper.js
sed -i -e "s/this.getCNPJOperadora(proposta.getInstance().btxplan)/\"$1\"/g" dbwrapper.js
sed -i -e 's/ extends obj_DBwrapper //g' dbwrapper.js
sed -i -e 's/super()/\/\/super()/g' dbwrapper.js
echo -e "\nmodule.exports = obj_DBwrapperCustom" >> dbwrapper.js
cp dbwrapper.js snoopdog.js