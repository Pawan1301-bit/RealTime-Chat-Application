// const { compareSync } = require("bcrypt");
const expressAsyncHandler = require("express-async-handler");   //if there is an error in side a async function it will catch and send it to express-error-handler
const Chat = require("../Models/ChatModel");
const User = require("../Models/UserModel");

// controller to access chat or create new one if does not exist
const acessChat = expressAsyncHandler(async (req, res) => {
    const { userId } = req.body;    //id of the user we want to create our chat with 

    if (!userId) {    //if no user id is provided
        console.log('user id request param not send with request');
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [ //we have to use and because we are working with the same feild id -- we cannot use (,) seprators becuase we can't have 2 feilds of same name user at the same level inside the object
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],          //here we are looking for a chat which is not groupchat and both users should be present in the chat 
    })
        .populate("users", "-password")  // we gonna load the user detail (name,email etc) without password and also load the last message details
        .populate("latestMessage");
    // when we have field with the id of another document like forigen key populate replace the id with actual full document with the other collection-- populate means show me the detail instead of id

    isChat = await User.populate(isChat, {  //we are getting the latestmessage senders detail and get there name, pic, email
        path: "latestMessage.sender",
        select: "name pic email"
    });

    if (isChat.length > 0) { //if the chat exist we will return 
        res.send(isChat[0]);       //as there can only be one personal one on one chat between  2 users -- like onescree chat between 2 users
    } else {  //if chat does not exist we are gonna create new chat
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        }

        // add the data to database
        try {
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createdChat._id })
                .populate("users", "-password");
            res.status(200).send(fullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message)
        }
    }

})

const fetchChats = expressAsyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }) //we will find the chats where the user is the part of 
            .populate("users", "-password")     //after finding the chat replace the users id with user object(name, email, pic)
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email"
                });
                res.status(200).send(results);
            });
    }
    catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

const createGroupChat = expressAsyncHandler( async(req, res)=>{
    if(!req.body.users || !req.body.name){
        res.status(500).send({message: "Please fill all the feilds"});
    }

    var users = JSON.parse(req.body.users);

    if(users.length < 2){
        return res.status(500).send("More than 2 users are required to form a group chat");
    }

    //adding the person creating the group in the group and making him the admin
    users.push(req.user);

    try {
        const  groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,            
            groupAdmin: req.user,
        });
        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }

})

const renameGroup = expressAsyncHandler(async (req,res)=>{
    const {chatId, chatName} = req.body

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,         // find
        {
            chatName,   //update -- since chatName : chatName
        },{
            new: true,
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if(!updatedChat){
        res.status(404);
        throw new Error("Chat not found");
    } else{
        res.json("updatedChat");
    }

})

const addToGroup = expressAsyncHandler(async (req, res)=>{
    const {chatId, userId} = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: {users: userId},
        },
        {
            new: true,
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!added){
        res.status(400)
        throw new Error("Chat not found");
    }else{
        res.json(added);
    }

})

const removeFromGroup = expressAsyncHandler(async (req, res)=>{
    const {chatId, userId} = req.body;

    const remove = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pop: {users: userId},
        },
        {
            new: true,
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!remove){
        res.status(400)
        throw new Error("Chat not found");
    }else{
        res.json(remove);
    }
})

module.exports = { acessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup };