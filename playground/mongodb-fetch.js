//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp?useNewUrlParser=true', (err, client) => {

    if (err) {
        return console.log('unable to connect to mongodb server');
    }
    console.log('Connected to MongoDB');
    const db = client.db('TodoApp');

    // var cursor = db.collection('Todos').find({
    //     _id:new ObjectID('5b7a0cad965c4b3f645f61e4')
    // });
    // cursor.toArray()
    // .then((docs) => {
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) =>{
    //     console.log('cant fetch');
    // })

    // var cursor = db.collection('Todos')
    // .find()
    // .count()
    // .then((count) => {
    //     console.log(`Count: ${count}`);
    // }, (err) =>{
    //     console.log('cant fetch',err);
    // })

    //simple find by user's name
    db.collection('Users').find({
        name:'ralf'
    })
    .toArray()
    .then(
        (docs) => {
            console.log(JSON.stringify(docs, undefined, 2));
        }, 
        (err) => {
            console.log('cant fetch');
        }
    );

    //do not close, otherwise the find will not execute
    //client.close();

});
