const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async (file, dest) => {
    try {
        const fileBase64 = file.buffer.toString('base64');
        const fileUri = `data:${file.mimetype};base64,${fileBase64}`;
        const result = await cloudinary.uploader.upload(fileUri, {
            resource_type:'auto',
            folder:`desimart/${dest}`
        });
        return result;
    }catch(err){
        console.error("Error in uploadToCloudinary service:", err);
        throw err;
    }
};

module.exports = {uploadToCloudinary}