const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/Todo');
const {User} = require('./../server/models/User');

var id = "5b7ee9b336624324f41a94ea";
if(!ObjectID.isValid(id)){
    console.log('id not valid');    
}

Todo.deleteMany({})
.then((result) => {
    console.log(result);
});


// Todo.findOneAndRemove({})
// .then((result) => {
//     console.log(result);
// });

Todo.findByIdAndRemove()
    .then((result) => {
        console.log(result);
});