const express = require('express');//importing express
const {books} = require('../data/books.json');//json book data import
const {users} = require('../data/users.json');//json user data import
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
    const data = req.body;

    if(!data){
        return res.status(400).json({
            success: false,
            message: 'No data provided'
        });
    }

    const book = books.find((each) => each.id === data.id)
        return res.status(400).json({
            success: false,
            message: 'Book already exist with this id'
        });

    const allBooks = [...books, data];
    return res.status(201).json({
        success: true,
        message: 'Book created successfully',
        data: allBooks
    });
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
        data: updatedBook });
    });
/**
 * Route: /books/issued/book
 * method: GET
 * Description: Get all issued books
 * Acess: Public
 * parameters: none
 */
router.get('/issued/by-user', (req, res) => {
    const usersWithIssuedBooks = users.filter((each) =>
        {if (each.issuedBook) return each
    });
    const issuedBooks =[];

    usersWithIssuedBooks.forEach((each) => {
        const book = books.find((book) => book.id === each.issuedBook);

        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedBooks.push(book);
    })
    if(issuedBooks.length===0)
        return res.status(404).json({
            success: false,
            message: 'No books issued yet'
        });
    return res.status(200).json({
        success: true,
        data: issuedBooks
    });
});
/**
 * Route: /books/issued/withfine
 * method: GET
 * Description: Get all issued books with fine
 * Acess: Public
 * parameters: none
 */
router.get('/issued/with-fine', (req,res)=>{
    const usersWithIssuedBooks = users.filter((each) => {
        if (each.issuedBook) return each
    });
    const issuedBooksWithFine = [];

    usersWithIssuedBooks.forEach((each) => {
        const book = books.find((book) => book.id === each.issuedBook);
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
        let returnDate = getDateInDays(each.returnDate);
        let currentDate = getDateInDays();
        // console.log(returnDate);
        // console.log(currentDate);
        if(currentDate>returnDate){
            book.issuedBy = each.name;
            book.issuedDate = each.issuedDate;
            book.returnDate = each.returnDate;
            issuedBooksWithFine.push(book);
        }
    });

    if(issuedBooksWithFine.length===0)
        return res.status(404).json({
            success: false,
            message: 'No books with fine'
        });
    return res.status(200).json({
        success: true,
        data: issuedBooksWithFine
    });
});
//default export
module.exports = router; //exporting the router

