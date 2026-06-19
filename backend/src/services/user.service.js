const User = require("../models/user.model");
const {uploadToCloudinary} = require("../utils/cloudinary");
const { generateToken , verifyToken} = require("../utils/jwt.utils");
const {hashPassword, comparePassword} = require("../utils/password");

const registerUser = async (userData) => {
    try{
        const {name, email, password, file, role, authProvider} = userData;
        const existingUser = await User.findOne({ email });
        if(existingUser){
            throw new Error("Email already in use");
        }
        let avatar = {url: "", public_id: ""};
        if(file){
            const uploadResult = await uploadToCloudinary(file, "avatars");
            avatar.url = uploadResult.secure_url;
            avatar.public_id = uploadResult.public_id;
        }
        const hashedPassword = await hashPassword(password);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "user",
            avatar,
            authProvider: authProvider || "local"
        });
        await newUser.save();
        const token = generateToken(newUser);
        return { message: "User registered successfully", token, user: newUser };
    }catch(error){
        console.error("Error in registerUser service:", error);
        throw error;
    }
};


const loginUser = async (email, password) => {
    try{
        const user = await User.findOne({ email });
        if(!user){
            throw new Error("User not found");
        }
        if(user.authProvider !== "local"){
            throw new Error(`Please login using ${user.authProvider}`);
        }
        const isMatch = await comparePassword(password, user.password);
        if(!isMatch){
            throw new Error("Invalid credentials");
        }
        const token = generateToken(user);
        return { message: "User logged in successfully", token, user };
    }catch(error){
        console.error("Error in loginUser service:", error);
        throw error;
    }
};


const getCurrentUser =async (_id) => {
    try{
        const user = await User.findById(_id);
        return user;
    }catch(error){
        console.error("Error in getCurrentUser service:", error);
        throw error;
    }
};


const updateUser = async (_id, name, file) => {
    try{
        let avatar = {url: "", public_id: ""}
        if(file){
            const uploadResult = await uploadToCloudinary(file, "avatars");
            avatar.url = uploadResult.secure_url;
            avatar.public_id = uploadResult.public_id;
        }
        const user = await User.findByIdAndUpdate(_id,{name, avater});
        return user;
    }
    catch(err){
        console.error("Error in updateUser service:", error);
        throw error;
    }
}


module.exports = { registerUser, loginUser, getCurrentUser, updateUser};