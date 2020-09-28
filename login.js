//creating variables and require modules
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

//creating connection to mysql
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'Wakanda2030',
	database : 'nodelogin'
});

//initializing express. Body parser will extract form data from login.html
var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//display login file to the client
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

//Handling the POST request
app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

//Handling the GET request
app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

//adding the listening port
var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
  });
