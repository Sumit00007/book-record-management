const express = require('express'); // importing express
const {users} = require('../data/users.json'); //json user data import

const router = express.Router(); // creating a router

/**
 * Route: /users
 * method: GET
 * Description: Get all users
 * Acess: Public
 * parameters: none
 */
router.get('/', (req, res) => {
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
router.get('/:id', (req, res) => {
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
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {
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
/**
 * Route: /users/:id
 * method: DELETE
 * Description: Delete user by id
 * Acess: Public
 * parameters: id 
 */
router.delete('/:id', (req, res) => {
    const {id} = req.params;
    const user = users.find((each) => each.id === id);

    if (!user){
        return res.status(404).json({ 
            success: false,
            message: 'User not found' });
    }
    const index = users.indexOf(user);
    users.splice(index,1);

    return res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        data: users
    });
});

module.exports = router; // exporting the router