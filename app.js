const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongo = require("mongodb");
const mongoClient = mongo.MongoClient;
let ObjectId = mongo.ObjectId;
const url = process.env.MONGO_URL || "mongodb://127.0.0.1:27017";
const port = process.env.PORT || 3000;

app.use("/", express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.engine("html", require("ejs").renderFile);

app.set("view engine", "html");

app.set("views", __dirname + "/views");

const connectMongo = (funct) =>
	mongoClient.connect(url, function (error, client) {
		if (error) {
			console.log(error);
		} else {
			console.log("DB connected");
			let db = client.db("ToDoList");
			let tasks = db.collection("Tasks");
			funct(tasks);
		}
	});

app.post("/tasks/new", function (req, res) {
	connectMongo((tasks) => {
		try {
			tasks.insertOne({
				timestamp: new Date(),
				description: req.body.description,
			});
		} catch (err) {
			console.log(err);
		}
	});
	res.redirect("/");
});

app.get("/tasks/index", (req, res) => {
	connectMongo((tasks) => {
		try {
			tasks.find({}).toArray((error, result) => {
				res.send(JSON.stringify(result));
			});
		} catch (err) {
			console.log(err);
		}
	});
});

app.put("/tasks/update", function (req, res) {
    console.log(req.body.info,req.body.id)
	let o_id = new ObjectId(req.body.id)
	connectMongo((tasks) => {
		try {
			tasks.updateOne(
				{ _id: o_id },
				{ $set: { description: req.body.description } }
			);
		} catch (err) {
			console.log(err);
		}
	});
});

app.get('/tasks/update/:id',( req,res ) =>{
	res.sendFile(__dirname + '/views/update.html');
})

app.delete("/tasks/delete/:id", (req, res) => {
    let o_id = new ObjectId(req.params.id);
    connectMongo((tasks) => {
        tasks.findOneAndDelete({_id: o_id}, (err, result) => {
            console.log(err, result);
        })
    })
})

app.get("/", function (req, res) {
	res.render("index");
});

app.listen(port);
