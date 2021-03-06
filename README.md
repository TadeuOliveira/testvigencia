# testvigencia

Cria um script que testa regras de vigência

## requisitos

node v12.14.0>
npm 6.13.4

## instalação

Após ter clonado o repositório, simplesmente digite:
```
npm install
```

## uso

O algoritmo automaticamente lê o dbwrapper da operadora desejada. Para tal, execute:

```
bash readclient.sh <operadora>
```

Se houverem campos requeridos para a execução correta do algoritmo, este script irá pedi-los na CLI durante sua execução.


Após a leitura do cliente, edite o arquivo ```assertions.js``` na pasta assertions para que ele execute os testes. Cada chave do array **assertions** representa um teste, que será especificado na hora da execução. Dentro e cada teste, haverá a chave **expected**, onde entram os resultados esperados para determinada entrada, e as outras chaves são parâmetros da função associada a este teste.

Caso queira simplesmente ver o que o teste está retornando, você pode executar

```
npm run resp
```

Este script executa a função computeVigencia do **dbwrapper.js**, não mostrando informações impressas na saída padrão (através de console.log, por exemplo).

Caso queira executar esta funcionalidade de forma customizada, execute o seguinte script para obter informações dos parâmetros que podem ser passados:

```
node runVigencia -h
```


Finalmente: para testar as asserções postas no **assertions**, execute o comando:

```
npm test <teste>
```

Vale destacar que o teste não precisa ser escrito por extenso. São definidos aliases que podem ser conferidos no próprio ```testrunner.js``` no objeto **alias**.

## contribuição

contribuições são bem vindas (já que algumas operadoras/administradoras podem apresentar peculiaridades em seus códigos que deverão ser reescritas).