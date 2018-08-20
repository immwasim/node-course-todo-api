var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

//model configuration
var Todo = mongoose.model('Todo', {
    text: {
        type:String
    },
    completed: {
        type:Boolean
    },
    completedAt: {
        type: Number
    }
});

var Todo = new Todo({text:"Make api for rte"});
Todo.save()
    .then(
        (doc) =>{
            console.log("saved", doc);
        },
        (err) => {
            console.log("cant save", err);
        }
);