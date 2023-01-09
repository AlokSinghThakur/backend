const express = require('express')
const db = require('./db.json')
const fs = require('fs')
const bodyParser = require('body-parser')
const noteModel = require("./note")
const async = require('async')


require('dotenv').config()


const MongoDB = require("./mongodb")

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

MongoDB.start()

app.get('/v1/api/mynotes',(req, res) => {
	async.auto({
		notes: function (cb) {
			noteModel.find().exec(function (err, notes) {
				if (err) {
					return cb("Unable to fetch notes.");
				}
				return cb(null, notes);
			});
		}
	}, function (err, results) {
		if (err) {
			return res.status(403).json({error: err});
		}
		return res.json({results: results.notes});
	});
});

app.post('/v1/api/addnotes',async(req,res)=>{
    const data = new noteModel({
      desc: req.body.desc,
      title: req.body.title,
    });
  
    const val = await data.save();
  
    res.send("Note Sucessfully Created");
  });

app.get('/notes', (req, res) => {
  res.json({
    "results": MongoDB.start
  })
})
app.post('/newnote', (req, res) => {
  // console.log(req)
  if (req.body.hasOwnProperty('note') && req.body.hasOwnProperty('title') && req.body.hasOwnProperty('desc')) {
    // both properties are present, so add the note to the list
    var notes = db.notes
    var note = req.body.note

    notes.push(note)
    fs.writeFile("db.json", JSON.stringify({ notes: notes }), () => { })

    res.send({
      "result": "created successfully",
    })
  } else {
    // one or both properties are missing
    let error = {}
    if (!req.body.hasOwnProperty('note')) {
      error.note = "request body must contain a 'note' property"
    }
    else if (!req.body.hasOwnProperty('desc')) {
      error.desc = "request body must contain a 'desc' property"
    }
    else if (!req.body.hasOwnProperty('title')) {
      error.title = "request body must contain a 'title' property"
    }
    res.status(400).send({
      "error": error,
    })
  }


})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})