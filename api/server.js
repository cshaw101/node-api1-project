// BUILD YOUR SERVER HERE
const express = require('express')
const User = require('./users/model')
const server = express()
server.use(express.json())



server.post('/api/users', (req, res) => {
    const user = req.body;
    if (!user.name || !user.bio) {
        res.status(422).json({
            message:'name and bio required'
        })
    }else {
        User.insert(user)
            .then(createdUser => {
                res.status(201).json(createdUser)
            })
            .catch(err => {
                res.status(500).json({
                    message: 'error creating users',
                    err: err.message,
                })
               })   
    }
})

server.get('/api/users', (req, res) => {
   User.find()
       .then(users => {
        res.json(users)
       })
       .catch(err => {
        res.status(500).json({
            message: 'error getting users',
            err: err.message,
        })
       })   
})

server.get('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
        .then(users => {
            if (!users) {
                res.status(404).json({ message:"The user with the specified ID does not exist"
            })
            }
            res.json(users)
        })
        .catch(err => {
            res.status(500).json({
                message:'error getting users',
                err: err.message,
                stack: err.stack,
            })
        })
})


server.use('*', (req, res) => {
    res.status(404).json({
        message: 'Not found'
    })
})


module.exports = server; // EXPORT YOUR SERVER instead of {}
