const {UserModel, BookModel} = require('../models');
const IssuedBook = require('../dtos/book-dtos');


exports.getAllBooks = async (req, res)=>{
    const books = await BookModel.find();

    if (books.length === 0)
        return res.status(404).json({ 
            success: false,
            message: 'No books found' });
    
    res.status(200).json({ 
        success: true,
        data: ( books) });
};

exports.getSingleBookById = async (req, res)=>{
    const { id } = req.params;

    const book = await BookModel.findById(id);
        if (!book){
            return res.status(404).json({ 
                success: false,
                message: 'Book not found' });
    
        }
        return res.status(200).json({ 
            success: true,
            data: book });
    
};
exports.getAllissuedBooks = async (req, res)=>{
    const users = await UserModel.find(
        { issuedBook: { $exists: true } },
    ).populate('issuedBook');

    const issuedBooks = users.map((each) => new IssuedBook(each) );

    console.log(issuedBooks);

        if(issuedBooks.length===0)
            return res.status(404).json({
                success: false,
                message: 'No books issued yet'
            });
        return res.status(200).json({
            success: true,
            data: issuedBooks
        });
    
};
exports.addNewBook = async (req, res)=>{  
    const {data} = req.body;

    if(!data){
        return res.status(400).json({
            success: false,
            message: 'No data provided'
        });
    }

    await BookModel.create(data);

    const allBooks = await BookModel.find();
    return res.status(201).json({
        success: true,
        message: 'Book created successfully',
        data: allBooks
    });
};
exports.updateBookById = async (req, res)=>{
    
        const { id } = req.params;
        const { data } = req.body;

        const updatedBook = await BookModel.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        );
        
    
        return res.status(200).json({ 
            success: true,
            message: 'Book updated successfully',
            data: updatedBook });
        
};

exports.issuedBooksWithFine = async (req, res)=>{
    const users = await UserModel.find(
        { issuedBook: { $exists: true } },
    ).populate('issuedBook');

    const books = users.map((each) => new IssuedBook(each) );
        
    
    const BooksWithFine =[];
    books.forEach((each) => {
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
            console.log(returnDate);
            console.log(currentDate);
            if(currentDate>returnDate){
                books.issuedBy = each.name;
                books.issuedDate = each.issuedDate;
                books.returnDate = each.returnDate;
                return BooksWithFine.push(each);
            }
            
        });
    
    if(BooksWithFine.length===0)
        return res.status(404).json({
            success: false,
            message: 'No books with fine'
        });
    return res.status(200).json({
            success: true,
            data:BooksWithFine
        });
    };