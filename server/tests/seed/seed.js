const { ObjectID } = require('mongodb');
const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');
const jwt = require('jsonwebtoken');

const uoneid = new ObjectID();
const utwoid = new ObjectID();

const users = [
    {
        _id: uoneid,
        email: 'qqddda@was.com',
        password: 'User1Pass',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({ _id: uoneid, access: 'auth' }, process.env.JWT_SECRET).toString()
            }
        ]
    },
    {
        _id: utwoid,
        email: 'rrsddddr@was.com',
        password: 'User2Pass',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({ _id: utwoid, access: 'auth' }, process.env.JWT_SECRET).toString()
            }
        ]
    }
];

const seedData = [
    {
        _id: new ObjectID(),
        text: 'First to do',
        _creator:uoneid
    },
    {
        _id: new ObjectID(),
        text: 'second to do',
        completed: true,
        completedAt: 333,
        _creator:utwoid
    }
]

const populateTodos = (done) => {
    Todo.deleteMany({})
        .then(() => {
            return Todo.insertMany(seedData);
        })
        .then(() => done());
};

const populateUsers = (done) => {
    User.deleteMany({})
        .then(() => {
            // cant use insertMany because 
            //we need the save function to trigger the pre save hook
            // that hashes and slats the password
            // This is async therefore we must wait till the process is completed 
            var userOne = new User(users[0]).save();
            var userTwo = new User(users[1]).save();
            return Promise.all([userOne, userTwo])
        })
        .then(() => done());
};

module.exports = { seedData, populateTodos, users, populateUsers };