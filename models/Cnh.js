const connect = require('./connect');

const Cnh = connect.sequelize.define('cnh', {
    nameCnh: {
        type: connect.Sequelize.STRING,
        allowNull: false	
    },
    paiCnh: {
        type: connect.Sequelize.STRING,
        allowNull: false	        
    },
    maeCnh: {
        type: connect.Sequelize.STRING,
        allowNull: false	        
    },
    nascCnh:{
        type: connect.Sequelize.DATE,
        allowNull: false	        
    },
    firstCnh:{
        type: connect.Sequelize.DATE,
        allowNull: false	        
    },
    validatCnh: {
        type: connect.Sequelize.DATE,
        allowNull: false	        
    },
    numbCnh: {
        type: connect.Sequelize.INTEGER,
        allowNull: false	        
    },
    cpfCnh: {
        type: connect.Sequelize.STRING,
        allowNull: false	        
    },
    rgCnh: {
        type: connect.Sequelize.INTEGER,
        allowNull: false	        
    },
    orgExpCnh: {
        type: connect.Sequelize.CHAR,
        allowNull: false	        
    },
    ufCnh: {
        type: connect.Sequelize.CHAR,
        allowNull: false	        
    },
    categCnh: {
        type: connect.Sequelize.CHAR,
        allowNull: false	        
    },
    imgCnh: {
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

module.exports = Cnh;
//Cnh.sync({force:true})