const expect = require("expect");
const request = require("supertest");

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');

const { ObjectID } = require('mongodb');
const { seedData, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);


describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({ text })
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
            .set('x-auth', users[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find()
                    .then((todos) => {
                        expect(todos.length.toBe(2));
                        done();
                    }).catch((e) => { done(); });
            })
    });
});

describe('GET /todos', () => {
    it('shouold get all todos', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return a todo data by id ', (done) => {
        request(app)
            .get(`/todos/${seedData[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(seedData[0].text);
            })
            .end(done);
    });

    it('should not return a todo created by another user', (done) => {
        request(app)
            .get(`/todos/${seedData[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('return 404 if todo not found', (done) => {
        var hex = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hex}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('return 404 for non object ids', (done) => {
        request(app)
            .get(`/todos/1212`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('DELETE todos/:id', () => {
    it('should delete a todo data by id ', (done) => {
        var hex = seedData[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hex}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(hex);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(hex)
                    .then((todo) => {
                        expect(todo).toBeFalsy();
                        done();
                    }).catch((e) => {
                        done(e);
                    });
            })
    });

    it('should NOT delete a todo data by id if I am not creator', (done) => {
        var hex = seedData[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hex}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
           
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(hex)
                    .then((todo) => {
                        expect(todo).toBeTruthy();
                        done();
                    }).catch((e) => {
                        done(e);
                    });
            })
    });

    it('return 404 if todo not found', (done) => {
        var hex = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${hex}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('return 404 for non object ids', (done) => {
        request(app)
            .delete(`/todos/1212`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('PATCH todos/:id', () => {
    it('should update a todo data by id ', (done) => {
        var hex = seedData[0]._id.toHexString();
        var text = "updated";

        request(app)
            .patch(`/todos/${hex}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({ completed: true, text: text })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof(res.body.todo.completedAt)).toBe('number');
                 
            })
            .end(done);
    });

    it('should NOT update a todo data of another user by id ', (done) => {
        var hex = seedData[0]._id.toHexString();
        var text = "updated";

        request(app)
            .patch(`/todos/${hex}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({ completed: true, text: text })
            .expect(404)
            .end(done);
    });

    it('should clear completdAt when todo not completed', (done) => {
        var hex = seedData[1]._id.toHexString();
        var text = "new text 2";

        request(app)
            .patch(`/todos/${hex}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({ completed: false, text: text })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy();
            })
            .end(done);
    });
});


describe('GET users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    })

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done)
    })
});

describe('POST /users/', () => {
    it('should create a user', (done) => {
        var email = 'swsws@was.com';
        var password = 'ertertert';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findOne({ email })
                    .then((user) => {
                        expect(user).toBeTruthy();
                        expect(user.password).not.toBe(password);
                        done();
                    }).catch((e) => {
                        done(e);
                    });
            })
    })

    it('should return validation errors if request is invalid', (done) => {
        var email = 'swswswwas.com';
        var password = 'rtert';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end(done)

    })

    it('should not create a user if email in use', (done) => {
        var email = users[0].email;
        var password = 'rtersdt';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end(done)
    })
}
);

describe('POST /users/login', () => {
    it('should login a user and return auth token', (done) => {
        var email = users[1].email;
        var password = users[1].password;

        request(app)
            .post('/users/login')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(users[1]._id)
                    .then((user) => {
                        expect(user.toObject().tokens[1]).toMatchObject(
                            {
                                access: 'auth',
                                token: res.headers['x-auth']
                            });
                        done();
                    })
                    .catch((e) => {
                        done(e);
                    })
            })
    })

    it('should reject invalid logins', (done) => {
        var email = users[1].email;
        var password = 'asasas';

        request(app)
            .post('/users/login')
            .send({ email, password })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(users[1]._id)
                    .then((user) => {
                        expect(user.tokens.length).toBe(1)
                        done();
                    })
                    .catch((e) => {
                        done(e);
                    })
            })
    })
});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(users[0]._id)
                    .then((user) => {
                        expect(user.tokens.length).toBe(0)
                        done();
                    })
                    .catch((e) => {
                        done(e);
                    })
            })
    })
});