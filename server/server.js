var express = require('express');
var bodyParser = require('body-parser');

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

