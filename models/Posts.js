const connect = require('./connect');
const users = require('./Users');

const Posts = connect.sequelize.define('posts', { 
    nameRg: {
		type: connect.Sequelize.STRING		
	},
	paiRg: {
		type: connect.Sequelize.STRING		
	},
	maeRg: {
		type: connect.Sequelize.STRING		
	},
	nascRg: {
		type: connect.Sequelize.DATE		
	},
	ExpRg: {
		type: connect.Sequelize.DATE		
	},
	orgExpRg: {
		type: connect.Sequelize.CHAR		
	},
	cityRg: {
		type: connect.Sequelize.STRING		
	},
	ufRg: {
		type: connect.Sequelize.CHAR		
	},
	rg: {
		type: connect.Sequelize.INTEGER		
	},	
	imgRg: {
		type: connect.Sequelize.STRING		
    },
   
    nameCpf: {
		type: connect.Sequelize.STRING		
	},
	cpf: {
		type: connect.Sequelize.STRING		
	},
	nascCpf: {
		type: connect.Sequelize.DATE		
	},
	imgCpf: {
		type: connect.Sequelize.STRING		
    },
    nameCtps: {
		type: connect.Sequelize.STRING		
	},
	pis: {
		type: connect.Sequelize.STRING		
	},
	numberCtps: {
		type: connect.Sequelize.INTEGER		
	},
	serieCtps: {
		type: connect.Sequelize.STRING		
	},
	imgCtps: {
		type: connect.Sequelize.STRING		
    },
    nameRm: {
		type: connect.Sequelize.STRING		
	},
	numberRm: {
		type: connect.Sequelize.INTEGER		
	},
	serieRm: {
		type: connect.Sequelize.STRING		
	},
	raRm: {
		type: connect.Sequelize.INTEGER		
	},
	imgRm: {
		type: connect.Sequelize.STRING    
    },
    idUser: {
		type: connect.Sequelize.INTEGER,
		references: {
			model: users,
			key: 'id'
		  }
	}
})
module.exports = Posts;
//Posts.sync({force: true})
//Permaneceu no projeto unicamente para servir de exemplo de chaves estrangeiras com sequelize