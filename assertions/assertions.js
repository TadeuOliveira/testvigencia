//neste arquivo, insira para a função desejada, determinados parâmetros e suas respostas esperadas
//as respostas esperadas estarão na chave expected, enquanto as outras chaves são os parâmetros
const assertions = {
	vigenciaOptionsArray: [
		{
			id: '2020-01-30',
			expected: [
				'2020-02-10',
				'2020-02-20',
				'2020-03-01',
				'2020-03-10',
				'2020-04-01',
				'2020-03-20',
				'2020-04-10'
			]
		},
		{
			id: '2020-02-15',
			expected: [
				'2020-03-10',
				'2020-04-01',
				'2020-03-20',
				'2020-04-10',
				'2020-04-20',
				'2020-05-01',
				'2020-05-10'
			]
		}

	]
}
module.exports = assertions