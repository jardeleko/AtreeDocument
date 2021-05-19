const Sequelize = require('sequelize')
//config connection 

	const sequelize = new Sequelize('AtreeDocument', 'root', '', {
		host: '127.0.0.1',
		dialect: 'mysql'
	})

	module.exports = {
		Sequelize: Sequelize,
		sequelize: sequelize
	};

sequelize.authenticate().then(function(){
	console.log("conectado com sucesso!")
}).catch(function(erro){
	catchonsole.log("Falha ao se conectar! " + erro)
}) 
