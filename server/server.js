require('./config/config');
const _ = require('lodash');

var express = require('express');
var bodyParser = require('body-parser');

const { ObjectID } = require('mongodb');



var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var {authenticate} = require('./middleware/authenticate');




var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

//routes
app.post('/todos', (req, res) => {
    //console.log(req.body);
    var todo = new Todo({
        text: req.body.text
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
            (todos) => {
                res.send({ todos });
            },
            (e) => {
                res.status(400).send(e)
            }
        );
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    Todo.findById(id)
        .then((todo) => {
            if (!todo) {
                res.status(404).send();
            }
            res.status(200)
                .send({ todo });
        })
        .catch((e) => { res.status(400).send(); });

});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send({ e: "invalid id" });
    }

    Todo.findByIdAndDelete(id)
        .then((result) => {
            if (!result) {
                res.status(404).send({ e: "no id with that supplied id" });
            }
            res.send(result);
        }).catch((e) => {
            res.status(400)
                .send();
        });
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    //only take necessary props from input

    if (!ObjectID.isValid(id)) {
        res.status(404).send({ e: 'invalid id' });
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
        .then((todo) => {
            if (!todo) {
                res.status(404).send({ e: 'coudl not update' });
            }
            res.send({ todo });
        })
        .catch((e) => {
            res.status(400).send();
        })
});

app.listen(port, () => {
    console.log(`server started on ${port}`);
});


app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save()
        .then(() => {
            return user.generateAuthToken();
        })
        .then((token) => {
            //custom header
            res.header('x-auth', token)
                .send(user);
        })
        .catch((e) => {
            res.status(400).send(e);
        })
});




app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
})


module.exports = { app };

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

