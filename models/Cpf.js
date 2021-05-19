const connect = require('./connect');

const Cpf = connect.sequelize.define('cpf', {

    nameCpf: {
        type: connect.Sequelize.STRING,
        allowNull: false		
	},
	cpf: {
        type: connect.Sequelize.STRING,
        allowNull: false		
	},
	nascCpf: {
        type: connect.Sequelize.DATE,
        allowNull: false		
	},
	imgCpf: {
        type: connect.Sequelize.STRING,
        allowNull: false		
    },
    idUser: {
        type: connect.Sequelize.INTEGER,
        allowNull: false
    },
    idCategory: {
        type: connect.Sequelize.INTEGER
    },
    documentValid: {
        type: connect.Sequelize.INTEGER
    },
    message: {
		type: connect.Sequelize.STRING
	}
})

module.exports = Cpf;
//Cpf.sync({force:true})
