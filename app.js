var express = require("express"),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	request = require("request");

var app = express();
var defaultRestUri = "http://localhost:3000/api";
//var defaultRestUri = "https://guarded-fortress-9150.herokuapp.com/api";
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
		var sorted_hangars = hangars.sort(function (a, b) {
			if (a.name < b.name) {
				return -1;
			}
			if (a.name > b.name) {
				return 1;
			}
			return 0;
		});
		res.render("index", {
			hangars: sorted_hangars,
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

app.get('/aircraft/new', function (req, res) {
	res.render("new_aircraft");
});

app.post('/aircraft/new', function (req, res) {
	request({
		method: "POST",
		uri: restUri+"/aircraft",
		form: {
			name: req.body.name,
			description: req.body.description,
			type: req.body.type,
			tail: req.body.tail,
			owner: req.body.owner,
			hangar: req.body.hangar
		}
	}, function (error, response, body) {
		if (error) {
			console.log(error);
		}
		res.header('Cache-Control', 
				   'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
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
app.get('/aircraft/:id/edit', function (req, res) {
	request(restUri+"/aircraft/"+req.params.id, 
			 function(err, response, body) {
			 	res.render("edit_aircraft", {
			 		aircraft: JSON.parse(body)
			 	});
			 }
	);
});
app.put('/aircraft/:id/edit', function (req, res) {
	request({
		method: "PUT",
		uri: restUri+"/aircraft/"+req.params.id,
		form: {
			name: req.body.name,
			description: req.body.description,
			type: req.body.type,
			tail: req.body.tail,
			owner: req.body.owner,
			hangar: req.body.hangar
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
// DELETE
app.delete("/aircraft/:id", function(req, res) {
	request({
		method: "DELETE",
		uri: restUri+"/aircraft/"+req.params.id
	}, function(error, response, body) {
		res.redirect("/");
	});
});

app.listen(process.env.PORT || 3001);