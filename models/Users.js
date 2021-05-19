const connect = require('./connect')
const Users = connect.sequelize.define('users', {
	id: {
		type: connect.Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
		},
		
	name: {
		type: connect.Sequelize.STRING,
		allowNull:false
	},
	email: {
		type: connect.Sequelize.STRING,
		allowNull:false
	},
	user: {
		type: connect.Sequelize.STRING,
		allowNull: false
	},

	passw: {
		type: connect.Sequelize.STRING, 
		allowNull:false
	},
	iAdmin: {
		type: connect.Sequelize.STRING
	}


})

module.exports = Users;

//Users.sync({force:true})
