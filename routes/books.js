const express = require('express');//importing express
const {books} = require('../data/books.json');//json book data import

const router = express.Router();//creating a router

/**
 * Route: /books
 * method: GET
 * Description:Get all books
 * Acess: Public
 * parameters: none
 */
//get all books
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        data: books
    });
});
/**
 * Route: books/:id
 * method: Get
 * Description: get books by id 
 * Acess: Public
 * parameters: id
 */
//get book by id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const book = books.find((each) => each.id === id);
    if (!book){
        return res.status(404).json({ 
            success: false,
            message: 'Book not found' });

    }
    return res.status(200).json({ 
        success: true,
        data: book });
}); 
/**
 * Route: /books
 * method: POST
 * Description: Create new book
 * Acess: Public
 * parameters: none
 */
router.post('/', (req, res) => {
    const {id, name, author, price,genre,publisher } = req.body;
    const book = books.find((each) => each.id === id);
    if (book){
        return res.status(400).json({ 
            success: false,
            message: 'Book already exist' });
    }
    books.push({ id, name, author, price, genre, publisher });
    res.status(201).json({ 
        success: true,
        message: 'Book created successfully',
        data: books });
});
/**
 * Route: /books/:id
 * method: PUT
 * Description: Update book by id
 * Acess: Public
 * parameters: id
 */
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    
    const book = books.find((each) => each.id === id);

    if (!book){
        return res.status(404).json({ 
            success: false,
            message: 'Book not found' });
    }
    const updatedBook = books.map((each) => {
        if (each.id === id){
            return { ...each, ...data };
        }
        return each;
    });
    return res.status(200).json({ 
        success: true,
        message: 'Book updated successfully',
        data: book });
    });
//default export
module.exports = router; //exporting the router

