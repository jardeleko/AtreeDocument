const connect = require('./connect');

const Rg = connect.sequelize.define('rg', {
    nameRg: {
        type: connect.Sequelize.STRING,
        allowNull: false		
    },
    paiRg: {
        type: connect.Sequelize.STRING,
        allowNull: false	
    },
    maeRg: {
        type: connect.Sequelize.STRING,
        allowNull: false
    },
    nascRg: {
        type: connect.Sequelize.DATE,
        allowNull:false		
    },
    ExpRg: {
        type: connect.Sequelize.DATE,
        allowNull: false	
    },
    orgExpRg: {
        type: connect.Sequelize.CHAR,
        allowNull: false	
    },
    cityRg: {
        type: connect.Sequelize.STRING,
        allowNull: false	
    },
    ufRg: {
        type: connect.Sequelize.CHAR,
        allowNull: false	
    },
    rg: {
        type: connect.Sequelize.INTEGER,
        allowNull: false
    },	
    imgRg: {
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

module.exports = Rg;
//Rg.sync({force: true})
