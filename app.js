var express = require("express"),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	request = require("request");

var app = express();
//var defaultRestUri = "http://localhost:3000/api";
var defaultRestUri = "https://guarded-fortress-9150.herokuapp.com/api";
var restUri = process.env.REST_URI || defaultRestUri;

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static("public"));

// READ
app.get('/', function (req, res) {
	request(restUri, function(error, response, body) {
		var hangars = JSON.parse(body);
		res.render("index", {
			hangars: hangars,
		});
	});
});

// CREATE
app.get('/hangar/new', function (req, res) {
	res.render("new_hangar");
});
app.post('/hangar/new', function (req, res) {
	request({
		method: "POST",
		uri: restUri+"/hangar",
		form : {
			name: req.body.name,
			description: req.body.description,
			location: req.body.location,
			size: req.body.size,
			capacity: req.body.capacity
		}
	}, function(error, response, body) {
		res.redirect("/");
	});
});

// UPDATE
app.get('/hangar/:id/edit', function (req, res) {
	request(restUri+"/hangar/"+req.params.id, 
			 function(err, response, body) {
			 	res.render("edit_hangar", {
			 		hangar: JSON.parse(body)
			 	});
			 }
	);
});
app.put('/hangar/:id/edit', function (req, res) {
	request({
		method: "PUT",
		uri: restUri+"/hangar/"+req.params.id,
		form: {
			name: req.body.name,
			description: req.body.description,
			location: req.body.location,
			size: req.body.size,
			capacity: req.body.capacity
		}
	}, function (error, response, body) {
		res.redirect("/");
	});
});

// DELETE
app.delete("/hangar/:id", function(req, res) {
	request({
		method: "DELETE",
		uri: restUri+"/hangar/"+req.params.id
	}, function(error, response, body) {
		res.redirect("/");
	});
});

app.listen(process.env.PORT || 3001);