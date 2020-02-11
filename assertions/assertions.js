//neste arquivo, insira para a função desejada, determinados parâmetros e suas respostas esperadas
//as respostas esperadas estarão na chave expected, enquanto as outras chaves são os parâmetros
//algumas datas sugeridas para testes: 2020-02-29, 2020-12-31, 2021-02-28
const assertions = {
	vigenciaOptionsArray: [
		{
			id: '2020-01-18',
			expected: [
				'2020-03-01',
			]
		},
		{
			id: '2020-01-19',
			expected: [
				'2020-03-15',
			]
		}
	],
	computeVigencia: [
		{
			id: '2020-02-05',
			expected: '2020-03-01'
		},
		{
			id: '2020-02-01',
			expected: '2020-02-15'
		}
	]
}
module.exports = assertions