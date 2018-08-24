var express = require('express');
var bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app = express();

app.use(bodyParser.json());

//routes
app.post('/todos', (req, res) => {
    //console.log(req.body);
    var todo = new Todo({
        text:req.body.text
    });

    todo.save()
    .then((doc) => {
        res.send(doc);
    }, 
    (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find()
    .then(
        (todos)=>{
            res.send({todos});
        },
        (e) => {
            res.status(400).send(e)
        }
    );
});

app.get('/todos/:id', (req,res) => {
    var id=req.params.id;
    if(!ObjectID.isValid(id)){
        res.status(404).send();
    }

    Todo.findById(id)
    .then((todo) => {
        if(!todo){
            res.status(400).send();
        }
        res.status(200)
        .send({todo});
    })
    .catch((e) => {res.status(400).send();});

});

app.listen(3000, () => {
    console.log('server started on 3000');
});



module.exports = {app};

// var user = new User({
//     email:'was@was.com'
// });

// user.save()
// .then((doc) => {console.log("saved", doc);}, (err) => {console.log("error", err);});


// var date = new Date();
// var ts = date.getTime();

// var Todo = new Todo({text:"Make prototype for Masterclass Curry", 
//     completed:false, 
//     completedAt:ts});
// Todo.save()
//     .then(
//         (doc) =>{
//             console.log("saved", doc);
//         },
//         (err) => {
//             console.log("cant save", err);
//         }
// );

// var Todo = new Todo({text:" make stuff    "});
// Todo.save()
//     .then(
//         (doc) =>{
//             console.log("saved", doc);
//         },
//         (err) => {
//             console.log("cant save", err);
//         }
// );

