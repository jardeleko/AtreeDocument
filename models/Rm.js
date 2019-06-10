const connect = require('./connect');

const Rm = connect.sequelize.define('rm', {
    nameRm: {
        type: connect.Sequelize.STRING,
        allowNull: false		
	},
	numberRm: {
        type: connect.Sequelize.INTEGER,
        allowNull: false	
	},
	serieRm: {
        type: connect.Sequelize.STRING,
        allowNull: false		
	},
	raRm: {
        type: connect.Sequelize.INTEGER,
        allowNull: false		
	},
	imgRm: {
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

module.exports = Rm;
//Rm.sync({force:true})