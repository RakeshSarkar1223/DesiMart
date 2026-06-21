const User = require("../models/user.model");
const {uploadToCloudinary} = require("../utils/cloudinary");
const { generateToken , verifyToken} = require("../utils/jwt.utils");
const {hashPassword, comparePassword} = require("../utils/password");
const cloudinary = require("../config/cloudinary");

const registerUser = async (userData) => {
    try{
        const {name, email, password, file, role, authProvider} = userData;
        const rolesArray = Array.isArray(role) ? role : (role ? [role] : ["user"]);
        const existingUser = await User.findOne({ email });
        
        if(existingUser){
            const hasAllRoles = rolesArray.every(r => existingUser.role.includes(r));
            if(hasAllRoles){
                throw new Error("Email already in use");
            } 
            else if(existingUser.authProvider !== "local"){
                throw new Error(`Email already registered via ${existingUser.authProvider}. Please login using ${existingUser.authProvider}`);
            }
            else{
                existingUser.role = Array.from(new Set([...existingUser.role, ...rolesArray]));
                await existingUser.save();
                const token = generateToken(existingUser);
                return { message: "User role updated successfully", token, user: existingUser };
            }
        }
        let avatar = {
            url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150", 
            public_id: ""
        };
        if(file){
            try {
                const uploadResult = await uploadToCloudinary(file, "avatars");
                avatar.url = uploadResult.secure_url;
                avatar.public_id = uploadResult.public_id;
            } catch (uploadErr) {
                console.error("Cloudinary upload failed, using default placeholder avatar:", uploadErr.message);
            }
        }
        const hashedPassword = await hashPassword(password);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: rolesArray,
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


const googleLoginUser = async (userData) => {
    try{
        const token = generateToken(userData);
        return { message: "User logged in successfully", token, user: userData };
    }catch(error){
        console.error("Error in googleLoginUser service:", error);
        throw error;
    }
};
const loginUser = async (email, password, role) => {
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
        // Role validation
        const rolesArray = Array.isArray(user.role) ? user.role : [user.role];
        if (!rolesArray.includes(role)) {
            throw new Error(`Unauthorized. This account is registered as [${rolesArray.join(', ')}], which does not include ${role}.`);
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
        const updateData = {};
        if (name) updateData.name = name;
        const user = await User.findById(_id);
        if (file) {
            try {
                const uploadResult = await uploadToCloudinary(file, "avatars");
                updateData.avatar = {
                    url: uploadResult.secure_url,
                    public_id: uploadResult.public_id
                };
                const oldAvatarId = user.avatar?.public_id;
                // console.log("Old Avatar Public ID:", oldAvatarId);
                if (oldAvatarId) {
                    await cloudinary.uploader.destroy(oldAvatarId);
                    // console.log("Old Avatar destroyed:", temp);
                }
            } catch (uploadErr) {
                console.error("Cloudinary upload failed during profile update, keeping existing avatar:", uploadErr.message);
            }
        }
        user.set(updateData);
        await user.save();   
        return user;
    }
    catch(err){
        console.error("Error in updateUser service:", err);
        throw err;
    }
}


module.exports = { registerUser, loginUser, getCurrentUser, updateUser, googleLoginUser};