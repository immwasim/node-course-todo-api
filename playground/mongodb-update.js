//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp?useNewUrlParser=true', (err, client) => {

    if (err) {
        return console.log('unable to connect to mongodb server');
    }
    console.log('Connected to MongoDB');
    const db = client.db('TodoApp');

    db.collection('Todos')

    //findOneAndUpdate
    db.collection('Todos')
    .findOneAndUpdate(
        {_id:new ObjectID('5b7a0cad965c4b3f645f61e4')},
        {$set:
            {completed:false}
        },
        {
            returnOriginal:false
        } 
    )
    .then(
        (result) => {
            console.log(result);
        }
    );

    db.collection('Users')
    .findOneAndUpdate(
        {
            _id:new ObjectID('5b7ab7e0bddd242af07a03b2')
        },
        {
            $set:{name:'babayaga'},
            $inc: { age: 1} 
        },
        {
            returnOriginal:false
        }
    )
    .then((result) => {
        console.log(result);
    })


    //do not close, otherwise the find will not execute
    //client.close();

});
