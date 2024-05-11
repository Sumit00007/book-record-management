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
/**
 * Route:/users/subscriptions-details/:id
 * method: GET
 * Description: Get user subscription details by id
 * Acess: Public
 * parameters: id
 */
router.get('/subscription-details/:id', (req, res) => {
    const { id } = req.params;

    const user = users.find((each) => each.id === id);
    if (!user){
        return res.status(404).json({ 
            success: false,
            message: 'User not found' });
    }
    const getDateInDays = (data="") => {
        let date;
        if (data === ""){
            date = new Date();// current date
    } else {
        date = new Date(data);// date from data
    }
    let days = Math.floor(date/(1000*60*60*24));
    return days;
    };

    const subscriptionType = (date) => {
        if( user.subscriptionType === "Basic"){
            date = date + 90;
        }else if (user.subscriptionType === "Standard"){
            date = date + 180;
        }else if (user.subscriptionType === "Premium"){
        date = date + 365};
        return date;
    }

    //subscription expiration calculation
    //January 1, 1970, 00:00:00 UTC// milliseconds

    let returnDate = getDateInDays(user.returnDate);
    let currentDate = getDateInDays();  
    let subscriptionDate = getDateInDays(user.subscriptionDate);
    let subscriptionExpiration = subscriptionType(subscriptionDate); 

    const data={
        ...user,
        subscriptionExpired: subscriptionExpiration < currentDate ,
        daysLeftForExpiration: 
        subscriptionExpiration <= currentDate ? 0 : subscriptionExpiration - currentDate
        ,
        

        fine: returnDate < currentDate ?
        subscriptionExpiration<= currentDate
        ? 200
        :100
        :0,
    };
    return res.status(200).json({
        success: true,
        data
    });
});

module.exports = router; // exporting the router