const express = require("express");
const { PrismaClient } = require('@prisma/client');

const {
    validateUserCreation,
    validateUserUpdate,
    validateUserId
} = require('./middleware/validationMiddleware');

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/users/:id', validateUserId, async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) }
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

app.post('/users', validateUserCreation, async (req, res) => {
    console.log('POST /users route hit');
    const { name, email, password } = req.body;
    try {
        const newUser = await prisma.user.create({
            data: { name, email, password }
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

app.put('/users/:id', validateUserUpdate, async (req, res) => {
    const { id } = req.params;
    const { name, password } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { name, password }
        });
        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

app.delete('/users/:id', validateUserId, async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await prisma.user.delete({
            where: { id: parseInt(id) }
        });
        res.json(deletedUser);
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
