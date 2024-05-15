const {UserModel,BookModel} = require("../models");

exports.getAllUsers = async (req, res)=>{
    const users = await UserModel.find();
    
    if (users.length ===0)
        return res.status(404).json({ 
            success: false,
            message: 'No users found' });
    
    res.status(200).json({
        success: true,
        data: users
        });
};

exports.getSingleUserById = async (req, res)=>{
    const {id} = req.params;
    const user = await UserModel.findById({_id:id});
    
    if (!user)
        return res.status(404).json({ 
            success: false,
            message: 'User not found' });
    
    res.status(200).json({
        success: true,
        data: user
        });
};
exports.createNewUser = async (req, res)=>{ 
        const {data} = req.body;

        if (!data)
            return res.status(400).json({
                success: false,
                message: 'No data provided'
            })
        await UserModel.find();
        const newUser = await UserModel.create(data);
        console.log(newUser);
        
        res.status(201).json({ 
            success: true,
            message: 'User created successfully',
            data: newUser });
};

exports.updateUserById = async (req,res)=>{
        const { id } = req.params;
        const {data} = req.body;
    
        const updatedUser = await UserModel.findOneAndUpdate(
            {_id:id},
            { $set: {...data}, },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
        });
};

exports.deleteUserById = async (req, res)=>{
        const {id} = req.params;
        const user = await UserModel.deleteOne({_id:id})
    
        if (!user){
            return res.status(404).json({ 
                success: false,
                message: 'User not found' });
        }
        return res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
};

exports.getSubscriptionDetailsById = async (req, res)=>{
    
        const { id } = req.params;
    
        const user = await UserModel.findById(id);
        console.log(user);

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
        // console.log(returnDate);
        let currentDate = getDateInDays();  
        // console.log(currentDate);
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
};