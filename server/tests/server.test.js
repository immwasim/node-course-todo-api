const expect = require("expect");
const request = require("supertest");

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const {ObjectID} = require('mongodb');

const seedData = [
    {
        _id: new ObjectID(),
        text:'First to do'
    },
    {
        _id: new ObjectID(),
        text:'second to do'
    } 
]

beforeEach((done) => {
    Todo.deleteMany({})
    .then(()=>{
        return Todo.insertMany(seedData);
    })
    .then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }
            Todo.find({text})
            .then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => {
                done(e);
            });
        })
    });

    it("should not create todo with invalid body data", (done) => {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            if(err){
                return done(err);
            }

        Todo.find()
        .then((todos)=>{
            expect(todos.length.toBe(2));
            done();
        }).catch((e) => {done();});
        
        })
    });
});

describe('GET /todos',() => {
    it('shouold get all todos', (done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });

});

describe('GET /todos/:id', () => {
    it('should return a todo data by id ', (done) => {
        request(app)
            .get(`/todos/${seedData[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(seedData[0].text);
            })
            .end(done);
    });

    it('return 404 if todo not found', (done) => {
        var hex = new ObjectID().toHexString();
        request(app)
        .get(`/todos/${hex}`)
        .expect(404)
        .end(done);
    });

    it('return 404 for non object ids', (done) => {
        request(app)
        .get(`/todos/1212`)
        .expect(404)
        .end(done);
    });
});
