//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp?useNewUrlParser=true', (err, client) => {
    
    if(err){
        return console.log('unable to connect to mongodb server');
    }

     console.log('Connected to MongoDB');
     const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text:'Some to do 1',
    //     completed:false
    // }, (err, result) => {
    //     if(err){
    //         return console.log('cannot insert record', err)
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne(
    //     {
    //         _id:999,
    //         name:'philomenia',
    //         age:100,
    //         location:'brampton'

    //     }, (err, result)=>{
    //         if(err){
    //             return console.log('cannot insert record', err)
    //         }
    //         console.log(JSON.stringify(result.ops, undefined, 2));
    //     }
    // );

    client.close();

});
