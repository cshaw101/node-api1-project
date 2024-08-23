// BUILD YOUR SERVER HERE
const express = require('express')
const User = require('./users/model')
const server = express()
server.use(express.json())



server.post('/api/users', (req, res) => {
    const user = req.body;
    if (!user.name || !user.bio) {
        res.status(400).json({
            message: "Please provide name and bio for the user"
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

server.delete('/api/users/:id', async (req, res) => {
const possibleUser = await User.findById(req.params.id)
if (!possibleUser) {
    res.status(404).json({
        message: "The user with the specified ID does not exist",
    })
}else {
    const deletedUser = await User.remove(possibleUser.id)
    res.status(200).json(deletedUser)
}
})

server.put('/api/users/:id', async (req, res) => {
    try {
      const possibleUser = await User.findById(req.params.id);
      
      // If the user with the specified ID is not found
      if (!possibleUser) {
        return res.status(404).json({
          message: "The user with the specified ID does not exist"
        });
      }
  
      // If the request body is missing the `name` or `bio` property
      if (!req.body.name || !req.body.bio) {
        return res.status(400).json({
          message: "Please provide name and bio for the user"
        });
      }
  
      // Update the user information
      const updatedUser = await User.update(req.params.id, req.body);
  
      // If update is successful, return the updated user
      return res.status(200).json(updatedUser);
      
    } catch (err) {
      // If there's an error during the update process
      return res.status(500).json({
        message: "The user information could not be modified",
        err: err.message,
      });
    }
  });
  


server.use('*', (req, res) => {
    res.status(404).json({
        message: 'Not found'
    })
})


module.exports = server; // EXPORT YOUR SERVER instead of {}
