const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Dummy data
let users = [
    {
        username: 'tonny',
        fullname: 'Tonny Johnson',
        role: 'developer',
        project: ['cat', 'dog'],
        activeYn: 'Y',
    },
    {
        username: 'johndoe',
        fullname: 'John Doe',
        role: 'manager',
        project: ['cat', 'tiger'],
        activeYn: 'N',
    },
];

// Routes
app.get('/', (req, res) => {
    res.send('Welcome!');
});

// Create a new user
app.post('/users', (req, res) => {
    const newUser = req.body;
    let allUsers = users;

    isExisted = allUsers.find((user) =>
        user.username.includes(newUser.username)
    );
    if (isExisted) {
        return res.status(409).send({ message: 'Username already exists' });
    }

    users.push(newUser);
    res.status(201).send(newUser);
});

// Get all users
app.get('/users', (req, res) => {
    const { username, fullname, role, project, activeYn } = req.query;

    let filteredUsers = users;

    if (username) {
        filteredUsers = filteredUsers.filter(
            (user) => user.username === username.toLowerCase()
        );
    }

    if (fullname) {
        filteredUsers = filteredUsers.filter((user) =>
            user.fullname.includes(fullname.toLowerCase())
        );
    }

    if (role) {
        filteredUsers = filteredUsers.filter(
            (user) => user.role === role.toLowerCase()
        );
    }

    if (project) {
        filteredUsers = filteredUsers.filter((user) =>
            user.project.includes(project.toLowerCase())
        );
    }

    if (activeYn) {
        filteredUsers = filteredUsers.filter(
            (user) => user.activeYn === activeYn.toUpperCase()
        );
    }

    if (!filteredUsers.length) {
        return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).json(filteredUsers);
});

// Update a user by username
app.patch('/users/:username', (req, res) => {
    const { username } = req.params;
    const updatedUser = req.body;
    let userIndex = users.findIndex((u) => u.username === username);

    if (userIndex === -1) {
        return res.status(404).send({ message: 'User not found' });
    }

    // Check for duplicate username
    if (updatedUser.username && updatedUser.username !== username) {
        const duplicateUser = users.find(
            (u) => u.username === updatedUser.username
        );
        if (duplicateUser) {
            return res.status(409).send({ message: 'Username already exists' });
        }
    }

    // Update user information
    users[userIndex] = { ...users[userIndex], ...updatedUser };
    res.status(200).json(users[userIndex]);
});

// Delete a user by username
app.delete('/users/:username', (req, res) => {
    const { username } = req.params;
    let userIndex = users.findIndex((u) => u.username === username);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.status(200).send({ message: 'User deleted successfully' });
    } else {
        res.status(404).send({ message: 'User not found' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
