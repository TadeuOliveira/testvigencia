#!/usr/bin/env bash

if [[ -z $1 ]]; then
	echo -e "\n\e[33mesqueceu os argumentos, meu consagrado\n"
	echo -e "uso: ./readclient.sh <cliente>\e[0m"
	exit 1
fi
mydir=`pwd`
cd ~
deneuvePaths=`find $cwd -name deneuve -type d -exec realpath {} \; 2>&1 | grep -v "Permission denied"`
cd $mydir
echo $deneuvePaths > temp.txt
wc temp.txt > raw
read lines words characters filename < raw 
rm raw
if [[ $words -eq 1 ]]; then
	echo -e "\e[32mdiretório deneuve lido com sucesso!\e[0m"
	way=$deneuvePaths
else
	echo -e "Os seguintes diretórios chamados deneuve foram encontrados:\n"
	echo $deneuvePaths
	echo -n "Por favor, especifique qual dos caminhos apresentados é válido (PS: nada de caminho relativo): "
	read way
	if [[ -d $way && $deneuvePaths =~ $way && -n `egrep  '/deneuve' <<< $way` ]]; then
		echo -e "caminho lido com sucesso!\n"
	else
		echo "digita esse caminho direito na próxima vez, energúmeno"
		exit 1
	fi
fi
if [[ -d "$way/custom/$1" ]]; then
	customDir="$way/custom/$1"
	echo -e "custom dir: ${customDir}\n"
	cp "$customDir/web/venda/js.src/dbwrapper.js" .	
else
	echo -e "\e[31mcliente inválido\e[0m"
	exit 1
fi
echo -e "\e[32mleitura efetuada com sucesso!\e[33m\nAjuste o arquivo assertions.\e[0m"
./extractfuncs.sh