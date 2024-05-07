const express = require('express');
const {users} = require('./data/users.json'); //json user data import
const {books} = require('./data/books.json'); //json book data import

const app = express();

const PORT = 8081;

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is up and running' });
});
/**
 * Route: /users
 * method: GET
 * Description: Get all users
 * Acess: Public
 * parameters: none
 */
app.get('/users', (req, res) => {
    res.status(200).json({
        success: true,
        data: users
    });
});
/**
 * Route: /users/:id
 * method: GET
 * Description: Get user by id
 * Acess: Public
 * parameters: id
 */
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);
    if (!user){
        return res.status(404).json({ 
            success: false,
            message: 'User not found' });
    }
    res.status(200).json({ 
        success: true,
        data: user });
});
/**
 * Route: /users
 * method: POST
 * Description: Create new user
 * Acess: Public
 * parameters: none 
 */
app.post('/users', (req, res) => {
    const {id, name,surname,subscriptionType,subscriptionDate, email } = req.body;
    
    const user = users.find((each ) => each.id === id);
    if (user){
        return res.status(400).json({ 
            success: false,
            message: 'User already exist' });
    }
    users.push({ id, name, surname, subscriptionType, subscriptionDate, email });
    res.status(201).json({ 
        success: true,
        message: 'User created successfully',
        data: users });
});
/**
 * Route: /users/:id
 * method: PUT
 * Description: Update user by id
 * Acess: Public
 * parameters: id 
 */
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const {data} = req.body;

    const user = users.find((each) => each.id === id);

    if (!user){
        return res.status(404).json({ 
            success: false,
            message: 'User not found' });
    }
    const updatedUsers = users.map((each) => {
        if (each.id === id){
            return { ...each, ...data };
        }
        return each;
    });
    return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUsers
    });
});
app.get("*", (req, res) => { 
    res.status(404).json({ message: 'This route does not exist' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});