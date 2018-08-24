const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/Todo');
const {User} = require('./../server/models/User');

var id = "5b7ee9b336624324f41a94ea";
if(!ObjectID.isValid(id)){
    console.log('id not valid');    
}

User.findById(id)
.then(
    (user) => {
        if(!user){
            return console.log('user not found');
        }
        console.log(user);
    })
.catch((e) => {console.log(e);});

//query, no user: user not found

//user found, print user

//errors handle that



// var id = '5b7ee615330a43172c0ec78d234as';

// if(!ObjectID.isValid(id)){
//     console.log('id not valid');
// }

// Todo.find({_id:id})
// .then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({_id:id})
// .then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id)
// .then((todo) => {
//     if(!todo){
//         return console.log('id not found');
//     }
//     console.log('Todo by Id', todo);
// }).catch((e) => console.log(e))