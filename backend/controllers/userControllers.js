const asyncHandler =  require('express-async-handler'); //this will handle async errors inside your express-routeHandler
const User = require('../Models/UserModel');
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async(req,res)=>{
    const {name, email, password, pic} = req.body  

    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please enter the fields");
    }
    const userExist = await User.findOne({email});

    if(userExist){
        res.status(400);
        throw new Error("User already exist");
    }
    const user = await User.create({
        name,
        email,
        password, 
        pic,
    });

    if(user){
        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            pic : user.pic,
            token: generateToken(user._id)
        });
    }else{
        res.status(400)
        throw new Error("failed to create user");
    }
})

const authUser = asyncHandler(async(req, res)=>{
    const {email, password} = req.body;

    const user = await User.findOne({email})

    if(user && (await user.matchPassword(password))){
        res.json({
            _id : user._id,
            name : user.name,
            email : user.email,
            pic : user.pic,
            token: generateToken(user._id)
        });
    }else{
        res.status(401);
        throw new Error("Invalid email or password");
    }

})

//we are gonna send data through query
//api/user?search=pabban
const allUsers = asyncHandler(async (req,res) => {
    // we will check if there exist a query inside the 
  const keyword=  req.query.search ? { //or query will return true if this is true for atleast 1 of the case
    $or : [     // so this will search by name and email and if its true for one of them we will return true
        { name: { $regex: new RegExp(req.query.search, 'i') } },
        { email: { $regex: new RegExp(req.query.search, 'i') } },
    ]   //regex provide regular expression capablities for pattern matchiing string in queries
  } : {}
//   console.log(keyword);
  
//   so in this line we are searching all the user that matches the keyword excluding the current logged-in-user
  const users = await User.find(keyword).find({_id: {$ne: req.user._id}});
  
//   ne - not equal and req.user._id means current user id as we do not want to see our own name why searching for others
  res.send(users);
})

module.exports = {registerUser, authUser, allUsers}