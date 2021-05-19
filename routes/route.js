const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerConfig = require('../config/multer');
const methodOverride = require('method-override');
const Users = require('../models/Users');
const Rg = require('../models/Rg');
const Cnh = require('../models/Cnh');
const Cpf = require('../models/Cpf');
const Ctps = require('../models/Ctps');
const Rm = require('../models/Rm');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require('passport');
require('../config/auth')(passport);
const {iAdmin} = require('./protected'); 

//bodyParser e middlewares
	router.use(methodOverride('_method'))
	//tecnicas antigas bodyparser
	router.use(bodyParser.urlencoded({extended: false}))
	router.use(bodyParser.json())
//iniciando session
	router.use(session({
		secret:"sessionkey",
		resave: true,
		saveUninitialized: true
	}))
	router.use(passport.initialize())
	router.use(passport.session())
	router.use(flash())
//definindo variaveis globais 
	router.use((req, res, next) => {
		res.locals.success_msg = req.flash("success_msg")
		res.locals.error_msg = req.flash("error_msg")
		res.locals.user = req.user || null;
		res.locals.error = req.flash("error")
		next()
	})
	
	router.get('/', (req, res) => {
		if(req.isAuthenticated()) res.render('./home/index');
		else res.redirect('./log');	
	})
	
	router.get('/terms', (req, res) => {
		res.render('./home/terms')
	})
//retorna tabela de relação para usuario
router.get('/date', (req, res) => {
	if(req.isAuthenticated()){
		Rg.findAll({where: { idUser: [req.user.id]}}).then((rgs) => {
			Cnh.findAll({where: { idUser: [req.user.id]}}).then((cnhs) => {
				Cpf.findAll({where: { idUser: [req.user.id]}}).then((cpfs) => {
					Ctps.findAll({where: { idUser: [req.user.id]}}).then((ctps) => {
						Rm.findAll({where: { idUser: [req.user.id]}}).then((rms) => {
							if(rgs != null || cnhs != null || cpfs != null || ctps != null || rms != null){
								res.render('./home/date', {rgs: rgs, cnhs: cnhs, cpfs: cpfs, ctps: ctps, rms: rms})
							}
						})
					})
				})
			})
		}).catch((err) => {
			console.log(err)
			req.flash("error_msg", "Erro ao enviar os dados!");
			res.redirect('/');
		})
	
	}	
	else res.redirect('/');
})
//envia os dados para o root
router.get('/dateRequest', iAdmin, (req, res) => {
	Rg.findAll().then((rgs) => {
		
		Cnh.findAll().then((cnhs) => {
			Cpf.findAll().then((cpfs) => {
				Ctps.findAll().then((ctps) => {
					Rm.findAll().then((rms) => {
						if(rgs != null || cnhs != null || cpfs != null || ctps != null || rms != null){
							res.render('./home/dateAccess', {rgs: rgs, cnhs: cnhs, cpfs: cpfs, ctps: ctps, rms: rms})
						}
					})
				})
			})
		})
	}).catch((err) => {
		console.log(err)
		req.flash("error_msg", "Erro ao enviar os dados!");
		res.redirect('/');
	})
});
router.get('/create', (req, res) => {
	res.render('./home/create')
})

router.get('/log', (req, res) => {
	res.render('./home/log')
})

router.post('/authenticate', (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/create",
		failureFlash: true 
	})(req, res, next)
})

router.get('/logout', (req, res, next) => {
	req.logout();
	res.redirect('/log');
	next()
})
//create users
router.post('/add',(req, res) => {
	console.log(req.body.name_sign);
	let erros = []

	if(!req.body.name_sign || typeof req.body.name_sign == undefined || req.body.name_sign == null){
		erros.push({message: "É necessário o nome do usuario"}) 
	} 
	if(!req.body.email_sign || typeof req.body.email_sign == undefined || req.body.email_sign == null){
		erros.push({message: "É necessario um email para o cadastro"})
	} 
	if(!req.body.user_sign || typeof req.body.user_sign == undefined || req.body.user_sign == null){
		erros.push({message: "campo usuario esta vazio, crie um @username"})
	}
	if(!req.body.pass_sign || typeof req.body.pass_sign == undefined || req.body.pass_sign == null){
		erros.push({message: "Campo de senha vazio"})
	}
	if(req.body.pass_sign != req.body.pass_sign2){
		erros.push({message: "Senhas não compatíveis"})
	}
	if(req.body.name_sign < 6){
		erros.push({message: "É necessário no mínimo 6 caracteres para senha"})
	}
	if(erros.length > 0){
		res.render('./home/create', {erros: erros})
	}
	
	else {	
		//hashing password
		let password = req.body.pass_sign;
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password, salt); 
		password = hash;

			Users.create({
			name: req.body.name_sign,
			email: req.body.email_sign,
			user: req.body.user_sign, 
			passw: password

		}).then(() => {
			req.flash("success_msg", "Usuario cadastrado");
			res.redirect('/');
		}).catch((err) => {
			req.flash("error_msg", "Erro ao salvar o usuario, tente novamente!");
			res.redirect('./home/create')
		})	
	}
})
//create posts
//multer->single, define apenas um arquivo por vez
router.post('/postrg', multer(multerConfig).single('imgRg'), (req, res) => {

	let errorRg = []
	
	if(!req.body.nomeRg || typeof req.body.nomeRg == undefined || req.body.nomeRg == null){
		errorRg.push({message: "É necessário o nome"}) 
	}
		if(!req.body.paiRg|| typeof req.body.paiRg == undefined || req.body.paiRg == null){
		errorRg.push({message: "Campo de filiação pai está vazio"}) 
	}
	if(!req.body.maeRg || typeof req.body.maeRg == undefined || req.body.maeRg == null){
		errorRg.push({message: "Campo de filiação mãe está vazio"}) 
	} 
	if(!req.body.nascRg || typeof req.body.nascRg == undefined || req.body.nascRg == null){
		errorRg.push({message: "Campo data de nascimento está vazio"}) 
	}
	if(!req.body.expedRg || typeof req.body.expedRg == undefined || req.body.expedRg == null){
		errorRg.push({message: "Data de expedição ausente no formulário"}) 
	}
	if(!req.body.orgRg || typeof req.body.orgRg == undefined || req.body.orgRg == null){
		errorRg.push({message: "Orgão de expedição ausente no formulário"}) 
	}
	if(!req.body.cidadeRg|| typeof req.body.cidadeRg == undefined || req.body.cidadeRg == null){
		errorRg.push({message: "Nome da cidade não consta no formulário"}) 
	}
	if(!req.body.ufRg || typeof req.body.ufRg == undefined || req.body.ufRg == null){
		errorRg.push({message: "Necessita setar o UF do estado em que foi feito a identidade do RG"}) 
	}
	if(!req.body.numRg || typeof req.body.numRg == undefined || req.body.numRg == null){
		errorRg.push({message: "Necessita do número do RG"}) 
	}
	if(errorRg.length > 0){
		res.render("./home/index", {errorRg: errorRg})
	} 
	else {
		let id = req.user.id
			Rg.create({
			nameRg: req.body.nomeRg,
			paiRg: req.body.paiRg,
			maeRg: req.body.maeRg,
			nascRg: req.body.nascRg,
			ExpRg: req.body.expedRg,
			orgExpRg: req.body.orgRg,
			cityRg: req.body.cidadeRg,
			ufRg: req.body.ufRg,
			rg: req.body.numRg,
			imgRg: req.file.filename,
			idUser: id,
			idCategory: 1
		}).then(() => {
			req.flash("success_msg", "Documento enviado com sucesso!");
			res.redirect('/');
		}).catch((err) => {
			req.flash("error_msg", "Erro ao enviar os dados, tente novamente!");
			res.redirect('/');		
		})
	}
})
router.post('/postcnh', multer(multerConfig).single('imgCnh'), (req, res) => {
	
	let errorCnh = []

	if(!req.body.nomeCnh || typeof req.body.nomeCnh == undefined || req.body.nomeCnh == null){
		errorCnh.push({message: "É necessário o nome"}) 
	}
	if(!req.body.paiCnh || typeof req.body.paiCnh == undefined || req.body.paiCnh == null){
		errorCnh.push({message: "Campo de filiação pai está vazio"}) 
	}
	if(!req.body.maeCnh || typeof req.body.maeCnh == undefined || req.body.maeCnh == null){
		errorCnh.push({message: "Campo de filiação mãe está vazio"}) 
	} 	 
	if(!req.body.dateNasc || typeof req.body.dateNasc == undefined || req.body.dateNasc == null){
		errorCnh.push({message: "Campo data de nascimento está vazio"}) 
	}	
	if(!req.body.habp || typeof req.body.habp == undefined || req.body.habp == null){
		errorCnh.push({message: "Setar datas de primeira habilitação"}) 
	}
	if(!req.body.validCnh || typeof req.body.validCnh == undefined || req.body.validCnh == null){
		errorCnh.push({message: "Preencher validade da Cnh"}) 
	}
	if(!req.body.registCnh || typeof req.body.registCnh == undefined || req.body.registCnh == null){
		errorCnh.push({message: "Falta o registro da Cnh"}) 
	}
	if(!req.body.cpfCnh || typeof req.body.cpfCnh == undefined || req.body.cpfCnh == null){
		errorCnh.push({message: "Cpf ausente no cadastro"}) 
	}
	if(!req.body.rgCnh || typeof req.body.rgCnh == undefined || req.body.rgCnh == null){
		errorCnh.push({message: "RG ausente no cadastro"}) 
	}
	if(!req.body.orgCnh || typeof req.body.orgCnh == undefined || req.body.orgCnh == null){
		errorCnh.push({message: "Orgão de expedição ausente no formulário"}) 
	}
	if(!req.body.ufCnh || typeof req.body.ufCnh == undefined || req.body.ufCnh == null){
		errorCnh.push({message: "Necessita setar o UF do estado em que foi feito a habilitação"}) 
	}
	if(!req.body.categ || typeof req.body.categ == undefined || req.body.categ == null){
		errorCnh.push({message: "Categoria esta em branco"}) 
	}
	if(errorCnh.length > 0){
		res.render("./home/index", {errorCnh: errorCnh})
	}
	else {	
		let id = req.user.id
		Cnh.create({
			nameCnh: req.body.nomeCnh,
			paiCnh: req.body.paiCnh,
			maeCnh: req.body.maeCnh,
			nascCnh: req.body.dateNasc,
			firstCnh: req.body.habp,
			validatCnh: req.body.validCnh,
			numbCnh: req.body.registCnh,
			cpfCnh: req.body.cpfCnh,
			rgCnh: req.body.rgCnh,
			orgExpCnh: req.body.orgCnh,
			ufCnh: req.body.ufCnh,
			categCnh: req.body.categ,
			imgCnh: req.file.filename,
			idUser: id,
			idCategory: 2
			}).then(() => {
			req.flash("success_msg", "Documento enviado com sucesso!");
			res.redirect('/');
		}).catch((err) => {
			req.flash("error_msg", "Erro ao enviar os dados, tente novamente!");
			res.redirect('/');		
		})
	}		
})
router.post('/postcpf', multer(multerConfig).single('imgCpf'), (req, res) => {
	let errorCpf = []

	if(!req.body.nomeCpf || typeof req.body.nomeCpf == undefined || req.body.nomeCpf == null){
		errorCpf.push({message: "Nome do Cpf não esta presente no formulario"})
	}
	if(!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null){
		errorCpf.push({message: "O cpf não foi enviado no formulario"})
	}
	if(!req.body.nascCpf || typeof req.body.nascCpf == undefined || req.body.nascCpf == null){
		errorCpf.push({message: "A data de Nascimento não foi inclusa"})
	}
	if(!req.file || typeof req.file == undefined || req.file == null){
		errorCpf.push({message: "Nenhuma imagem foi enviada"})
	}
	if(errorCpf.length > 0){
		res.render('./home/index', ({errorCpf: errorCpf}))
	}
	else{				
		let id = req.user.id
		Cpf.create({
			nameCpf: req.body.nomeCpf,
			cpf: req.body.cpf,
			nascCpf: req.body.nascCpf,
			imgCpf: req.file.filename,
			idUser: id,
			idCategory: 3
		}).then(() => {
			req.flash("success_msg", "Documento enviado com sucesso!");
			res.redirect('/');
		}).catch((err) => {
			req.flash("error_msg", "Erro ao enviar os dados, tente novamente!");
			res.redirect('/');		

		})	
	}
})
router.post('/postctps', multer(multerConfig).single('imgCtps'), (req, res) => {
	errorCtps = []
	
	if(!req.body.nomeCtps || typeof req.body.nomeCtps == undefined || req.body.nomeCtps == null){
		errorCtps.push({message: "Nome não enviado no formulario"})
	}
	if(!req.body.pis || typeof req.body.pis == undefined || req.body.pis == null){
		errorCtps.push({message: "Pis não informado"})	
	}
	if(!req.body.numCtps || typeof req.body.numCtps == undefined || req.body.numCtps == null){
		errorCtps.push({message: "Numero não informado no formulário enviado"})	
	}
	if(!req.body.serie || typeof req.body.serie == undefined || req.body.serie == null){
		errorCtps.push({message: "Numero de série não informado"})	
	}
	if(!req.body.ufCtps || typeof req.body.ufCtps == undefined || req.body.ufCtps == null){
		errorCtps.push({message: "UF não informado"})	
	}
	if(!req.file || typeof req.file == undefined || req.file == null){
		errorCtps.push({message: "Imagem não enviada"})	
	}
	if(errorCtps.length > 0){
		res.render('./home/index', ({errorCtps: errorCtps}))
	}
	else {
		let id = req.user.id
		Ctps.create({
			nameCtps: req.body.nomeCtps,
			pis: req.body.pis,
			numberCtps: req.body.numCtps,
			serieCtps: req.body.serie,
			ufCtps: req.body.ufCtps,
			imgCtps: req.file.filename,
			idUser: id,
			idCategory: 4
		}).then(() => {
			req.flash("success_msg", "Documento enviado com sucesso!");
			res.redirect('/');
		}).catch((err) => {
			req.flash("error_msg", "Erro ao enviar os dados, tente novamente!");
			res.redirect('/');		

		})	
	}
});
router.post('/postrm', multer(multerConfig).single('imgRm'), (req, res) => {
	errorRm = []
	if(!req.body.nomeRm || typeof req.body.nomeRm == undefined || req.body.nomeRm == null){
		errorRm.push({message: "Necessario nome no formulário"})
	}
	if(!req.body.numRm || typeof req.body.numRm == undefined || req.body.numRm == null){
		errorRm.push({message: "Necessario numero no formulário"})
	}
	if(!req.body.serieRm || typeof req.body.serieRm == undefined || req.body.serieRm == null){
		errorRm.push({message: "Numero de serie invalido"})
	}
	if(!req.body.ra || typeof req.body.ra == undefined || req.body.ra == null){
		errorRm.push({message: "Necessario numero do RA"})
	}
	if(!req.file || typeof req.file == undefined || req.file == null){
		errorRm.push({message: "Nennhuma foto enviada"})
	}
	if(errorRm.length > 0){
		res.render('./home/index', ({errorRm: errorRm}))
	}
	else {
		let id = req.user.id
		Rm.create({
			nameRm: req.body.nomeRm,
			numberRm: req.body.numRm,
			serieRm: req.body.serieRm,
			raRm: req.body.ra,
			imgRm: req.file.filename,
			idUser: id,
			idCategory:5
		}).then(() => {
			req.flash("success_msg", "Documento enviado com sucesso!");
			res.redirect('/');
		}).catch((err) => {
			req.flash("error_msg", "Erro ao enviar os dados, tente novamente!");
			res.redirect('/');		

		})	
	}
})
//update users
router.put('/validaterg/:id', (req, res) => {
	let valid = req.body.validate ? '1' : '0';
	Rg.update(
		{message: req.body.messageRg,
		documentValid: [valid]},
		{where: {id: req.params.id}}).then((rgs) => {
		req.flash("success_msg", "Formulário atualizado");
		res.redirect('/dateRequest');
	}).catch((err) => {
		req.flash("error_msg", "Erro ao enviar feedback!");
		res.redirect('/dateRequest')
	})	
})
router.put('/validatecnh/:id', (req, res) => {
	let valid = req.body.validate ? '1' : '0';
	Cnh.update(
		{message: req.body.messageCnh,
		documentValid: [valid]},
		{where: {id: req.params.id}}).then((cnhs) => {
		req.flash("success_msg", "Formulário atualizado");
		res.redirect('/dateRequest');
	}).catch((err) => {
		req.flash("error_msg", "Erro ao enviar feedback!");
		res.redirect('/dateRequest')
	})	
})
router.put('/validatecpf/:id', (req, res) => {
	let valid = req.body.validate ? '1' : '0';
	Cpf.update(
		{message: req.body.messageCpf,
		documentValid: [valid]},
		{where: {id: req.params.id}}).then((cpfs) => {
		req.flash("success_msg", "Formulário atualizado");
		res.redirect('/dateRequest');
	}).catch((err) => {
		req.flash("error_msg", "Erro ao enviar feedback!");
		res.redirect('/dateRequest')
	})	
})
router.put('/validatectps/:id', (req, res) => {
	let valid = req.body.validate ? '1' : '0';
	Ctps.update(
		{message: req.body.messageCtps,
		documentValid: [valid]},
		{where: {id: req.params.id}}).then((ctps) => {
		req.flash("success_msg", "Formulário atualizado");
		res.redirect('/dateRequest');
	}).catch((err) => {
		req.flash("error_msg", "Erro ao enviar feedback");
		res.redirect('/dateRequest')
	})	
})
router.put('/validaterm/:id', (req, res) => {
	let valid = req.body.validate ? '1' : '0';
	console.log(valid)
	console.log(req.body.messageRm)
	Rm.update(
		{message: req.body.messageRm,
		documentValid: [valid]},
		{where: {id: req.params.id}}).then((rms) => {
		req.flash("success_msg", "");
		res.redirect('/dateRequest');
	}).catch((err) => {
		req.flash("error_msg", "Erro ao enviar feedback!");
		res.redirect('/dateRequest')
	})	
})
//delete users
router.delete('/deleterg/:id', (req, res) => {
	Rg.destroy({where: {'id': req.params.id}}).then(() => {
		req.flash("success_msg", "Solicitação deletada com sucesso!")
		res.redirect('/date')
	}).catch((err) => {
		req.flash("error_msg", "Erro ao encontrar a publicação")
		res.send("Essa solicitação não existe " + err)
		res.redirect('/date')
	})
})
router.delete('/deletecnh/:id', (req, res) => {
	Cnh.destroy({where: {'id': req.params.id}}).then(() => {
		req.flash("success_msg", "Solicitação deletada com sucesso!")
		res.redirect('/date')
	}).catch((err) => {
		req.flash("error_msg", "Erro ao encontrar a publicação")
		res.send("Essa solicitação não existe " + err)
		res.redirect('/date')
	})

})
router.delete('/deletecpf/:id', (req, res) => {
	Cpf.destroy({where: {'id': req.params.id}}).then(() => {
		req.flash("success_msg", "Solicitação deletada com sucesso!")
		res.redirect('/date')
	}).catch((err) => {
		req.flash("error_msg", "Erro ao encontrar a publicação")
		res.send("Essa solicitação não existe " + err)
		res.redirect('/date')
	})
})	
router.delete('/deletectps/:id', (req, res) => {
	Ctps.destroy({where: {'id': req.params.id}}).then(() => {
		req.flash("success_msg", "Solicitação deletada com sucesso!")
		res.redirect('/date')
	}).catch((err) => {
		req.flash("error_msg", "Erro ao encontrar a publicação")
		res.send("Essa solicitação não existe " + err)
		res.redirect('/date')
	})
})
router.delete('/deleterm/:id', (req, res) => {
	Rm.destroy({where: {'id': req.params.id}}).then(() => {
		req.flash("success_msg", "Solicitação deletada com sucesso!")
		res.redirect('/date')
	}).catch((err) => {
		req.flash("error_msg", "Erro ao encontrar a publicação")
		res.send("Essa solicitação não existe " + err)
		res.redirect('/date')
	})
})
module.exports = router;