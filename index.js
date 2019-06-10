const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const compiler = require('ember-template-compiler');
const path = require ("path");
const route = require("./routes/route");
app.use(express.static('public/img'));
app.use(route);
//config template engine
	//handlebars
	app.engine('handlebars', handlebars({defaultLayout: 'main'}))
	app.set('view engine', 'handlebars')
	app.engine('handlebars', handlebars({
		helpers:{
			buttonDate: function(documentValid){
				if(documentValid == '1'|| documentValid == 1){
				
					let	result = '</form><button class="btn btn-success">Aceito</button>'
					return new compiler.EmberHandlebars.SafeString(result);
				}
				else if(documentValid == '0'|| documentValid == 0){
					let result = '<button class="btn btn-danger">Deletar</button>'
					return new compiler.EmberHandlebars.SafeString(result);
				}
				else{			
					let result = '</form><button class="btn btn-warning">Aguardando </button>'		
					return new compiler.EmberHandlebars.SafeString(result);
				}
			}
		}
	}))
	
	//static
	app.use(express.static(path.join(__dirname, 'static')))

//route app
app.get('/', (req, res) => {
	res.render('home/log')
	//atualizar para página de login
})

app.get('./home/show', (req, res) =>{
	res.render("./home/show")
}) 
const PORT = 6660

app.listen(PORT, () => {
	console.log("Servidor rodando na url http://localhost:6660")
})
