const express = require('express'); // importing express
// const {users}=require('..data/users.json');
// const {books}=require('..data/books.json');
const{getAllUsers,getSingleUserById, deleteUserById, updateUserById, getSubscriptionDetailsById,createNewUser} = require('../controllers/users.controller'); //importing the controller function

const router = express.Router(); // creating a router

/**
 * Route: /users
 * method: POST
 * Description: Create new user
 * Acess: Public
 * parameters: none 
 */
router.post('/', createNewUser);
/**
 * Route: /users
 * method: GET
 * Description: Get all users
 * Acess: Public
 * parameters: none
 */
router.get('/', getAllUsers);
/**
 * Route: /users/:id
 * method: GET
 * Description: Get user by id
 * Acess: Public
 * parameters: id
 */
router.get('/:id', getSingleUserById);
/**
 * Route: /users/:id
 * method: PUT
 * Description: Update user by id
 * Acess: Public
 * parameters: id 
 */
router.put('/:id', updateUserById);
/**
 * Route: /users/:id
 * method: DELETE
 * Description: Delete user by id
 * Acess: Public
 * parameters: id 
 */
router.delete('/:id', deleteUserById);
/**
 * Route:/users/subscriptions-details/:id
 * method: GET
 * Description: Get user subscription details by id
 * Acess: Public
 * parameters: id
 */
router.get('/subscription-details/:id', getSubscriptionDetailsById);

module.exports = router; // exporting the router