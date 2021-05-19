const connect = require('./connect');

const Ctps = connect.sequelize.define('ctps', {
    nameCtps: {
        type: connect.Sequelize.STRING,
        allowNull: false	
	},
	pis: {
        type: connect.Sequelize.STRING,
        allowNull: false		
	},
	numberCtps: {
        type: connect.Sequelize.INTEGER,
        allowNull: false	
	},
	serieCtps: {
        type: connect.Sequelize.STRING,
        allowNull: false		
    },
    ufCtps: {
        type: connect.Sequelize.STRING,
        allowNull:false
    },
	imgCtps: {
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

module.exports = Ctps;
//Ctps.sync({force:true})
