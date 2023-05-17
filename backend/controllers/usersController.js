const User=require('../models/User')
const Note=require('../models/Note')
const asyncHandler=require('express-async-handler')
const bcrypt=require('bcrypt')


//@desc Get users
//@route GET /users
//@access  Private

const getUsers=asyncHandler( async(req, res)=>{
    const users=await User.find().select('-password').lean()
    if(!users?.length){
        return res.status(400).json({message:'No users available!'})
    }
    res.json(users);
   
})

//@desc Create user
//@route POST /users
//@access Private

const createUser=asyncHandler( async(req, res)=>{
    const {username, password,roles}=req.body
    //validate data for empty fields
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({message: "Kindly fill all fields"})
    }

    //check for duplicates
    const duplicate=await User.findOne({username}).lean().exec()

    if (duplicate) {
        return res.status(409).json({message:"Username already exists"})
    }

    //hash the password
    const hashedPassword=await bcrypt.hash(password,10)//salt rounds 10

    const userObject={username,"password":hashedPassword,roles}

    //create and store new user
    const user =await User.create(userObject)

    if (user) {
        res.status(201).json({message:`New user ${username} registered`})
    }else{
        res.status(400).json({message:'Invalid user data provided'})
    }
})





//@desc Update user
//@route Patch /users
//@access Private

const updateUser=asyncHandler( async(req, res)=>{
    const {id, username,roles,active,password}=req.body
    if (!id){
        return res.status(400).json({message:'Kindly fill id field'})
    }else if(!username || !Array.isArray(roles) || !roles.length || typeof active!=='boolean'){
        return res.status(400).json({message:'Kindly fill all fields'})
    }

    const user= await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({message:"User not available"})
    }


    //check for duplicate
    const duplicate=await User.findOne({username}).lean().exec()

    //allow only to update the current user
    if (duplicate && duplicate?._id.toString() !==id) {
        return res.status(409).json({message:'Duplicate username'})
    }

    user.username=username
    user.roles=roles
    user.active=active

    if(password){
        //hash it
        user.password=await bcrypt.hash(password,10)
    }
    const updateUser=await user.save()

    res.json({message:`${updateUser.username} updated!`})
})

//@desc Delete user
//@route DELETE /users
//@access Private

const deleteUser=asyncHandler( async(req, res)=>{
    const {id}=req.body

    if (!id) {
        return res.status(400).json({message:"Kindly provide user ID"})
    }

    const note= await Note.findOne({user:id}).lean().exec()
    if(note?.length){
        return res.status(400).json({message:'User has assigned notes'})
    }
    
    const user=await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({message:'User not available'})
    }

    const result= await user.deleteOne()

    const reply=`User ${result.username} Id: ${result._id} deleted`

    res.json(reply)
})

module.exports={
    getUsers,
    createUser,
    updateUser,
    deleteUser
}