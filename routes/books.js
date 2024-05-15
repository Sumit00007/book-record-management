const express = require('express');//importing express
// const {books} = require('../data/books.json');//json book data import
// const {users} = require('../data/users.json');//json user data import
const {getAllBooks, getSingleBookById,getAllissuedBooks, addNewBook, updateBookById, issuedBooksWithFine} = require('../controllers/books.controller');//importing the controller

const router = express.Router();//creating a router

/**
 * Route: /books
 * method: GET
 * Description:Get all books
 * Acess: Public
 * parameters: none
 */
//get all books
router.get('/', getAllBooks);
/**
 * Route: books/:id
 * method: Get
 * Description: get books by id 
 * Acess: Public
 * parameters: id
 */
//get book by id
router.get('/:id', getSingleBookById); 
/**
 * Route: /books/issued/book
 * method: GET
 * Description: Get all issued books
 * Acess: Public
 * parameters: none
 */
router.get('/issued/by-user', getAllissuedBooks);
/**
 * Route: /books
 * method: POST
 * Description: Create new book
 * Acess: Public
 * parameters: none
 */
router.post('/', addNewBook)
    ;
/**
 * Route: /books/:id
 * method: PUT
 * Description: Update book by id
 * Acess: Public
 * parameters: id
 */
router.put('/:id', updateBookById);
/**
 * Route: /books/issued/withfine
 * method: GET
 * Description: Get all issued books with fine
 * Acess: Public
 * parameters: none
 */
router.get('/issued/with-fine', issuedBooksWithFine);
//default export
module.exports = router; //exporting the router

