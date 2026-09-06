const User = require('../models/user')
const jwt = require('jsonwebtoken');

exports.getUserAll = (req, res, next) => {
    User.findAll()
        .then(users => {
            res.status(200).json({ users: users });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Failed to fetch users" });
        });
}

exports.getUser = (req, res, next) => {
    const userUuid = req.params.userId;
    User.findOne({ where: { uuid: userUuid } })
        .then(user => {
            if (!user) {
                return res.status(404).json({message: 'user not found'})
            }
            res.status(200).json({ user: user });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Error fetching user" });
        });
}

exports.createUser = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    User.create({
        name:name,
        email :email
    })
        .then(result => {
            console.log('Created User');
            res.status(201).json({
                message: "User created successfully",
                user : result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Failed to create user" });
        })
}

exports.updateUser = (req, res, next) => {
    const userUuid = req.params.userId;
    const updatedName = req.body.name;
    const updatedEmail = req.body.email;
    
    // Authorization check
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Authentication required" });

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err || decoded.actorUuid !== userUuid) {
            return res.status(403).json({ message: "You can only update your own profile" });
        }

        User.findOne({ where: { uuid: userUuid } })
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: 'User not found'});
                }
                user.username = updatedName || user.username;
                user.email = updatedEmail || user.email;
                return user.save();
            })
            .then(result => {
                if (result) {
                    res.status(200).json({message: "User Updated", user: result});
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ message: "Update failed" });
            });
    });
}

exports.deleteUser = (req,res,next) => {
    const userUuid = req.params.userId;
    
    // Authorization check
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Authentication required" });

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err || decoded.actorUuid !== userUuid) {
            return res.status(403).json({ message: "You can only delete your own account" });
        }

        User.findOne({ where: { uuid: userUuid } })
            .then(user => {
                if (!user) {
                    return res.status(404).json({message: " User not found "})
                }
                return User.destroy({
                    where: {
                        uuid: userUuid
                    }
                })
            })
            .then(result => {
                res.status(200).json({ message: "User deleted"})
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ message: "Deletion failed" });
            })
    });
}