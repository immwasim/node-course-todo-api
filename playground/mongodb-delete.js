//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp?useNewUrlParser=true', (err, client) => {

    if (err) {
        return console.log('unable to connect to mongodb server');
    }
    console.log('Connected to MongoDB');
    const db = client.db('TodoApp');

    db.collection('Users')
    
    //deleteMany
    // db.collection('Todos')
    // .deleteMany({text:'Some to do 1'})
    // .then(
    //     (result) => {
    //         console.log(result);
    //     });

    //deleteOne
    // db.collection('Todos')
    // .deleteOne({text:'ANOTHER DOCUMENTT!!!!'})
    // .then(
    //     (result) => {
    //         console.log(result);
    //     });

    //findOneAndDelete
    // db.collection('Todos')
    // .findOneAndDelete({completed:false})
    // .then(
    //     (result) => {
    //         console.log(result);
    //     });

    db.collection('Users').findOneAndDelete({_id:new ObjectID('5b7a198bbddd242af07a03b1')})
    .then(
        (result) => {
            console.log(result);
        },
        (err) => {
            console.log(err);
        }
    );



    //do not close, otherwise the find will not execute
    //client.close();

});
