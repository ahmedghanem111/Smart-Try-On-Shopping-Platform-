const { Client, handle_file } = require("@gradio/client");
const TryOn = require('../models/TryOn');
const User = require('../models/User')
const cloudinary = require('../config/cloudinary');

const generateTryOn = async (req, res) => {
    const { personImage, garmentImage, description } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (!user.height || !user.weight) {
            return res.status(400).json({
                success: false,
                message: "Profile Incomplete",
                error: "Please enter your height and weight in your profile before using the Virtual Try-On."
            });
        }

        console.log("Uploading images to Cloudinary...📸");
        const personUpload = await cloudinary.uploader.upload(personImage, { folder: "fitme/people" });
        const garmentUpload = await cloudinary.uploader.upload(garmentImage, { folder: "fitme/garments" });

        console.log("Connecting to AI Engine...⏳");

        const app = await Client.connect("yisol/IDM-VTON", {
            token: process.env.HF_TOKEN
        });

        console.log("Running AI Try-On (Applying handle_file patch)...🤖");

        const result = await app.predict("/tryon", [
            {
                "background": handle_file(personUpload.secure_url),
                "layers": [],
                "composite": null
            },
            handle_file(garmentUpload.secure_url),
            description || "fashionable garment",
            true,
            true,
            30,
            42
        ]);

        const tempAiUrl = result.data[0].url;

        console.log("Saving AI result to permanent storage...");
        const finalResultUpload = await cloudinary.uploader.upload(tempAiUrl, {
            folder: "fitme/results"
        });

        const newTryOn = await TryOn.create({
            user: req.user._id,
            personImage: personUpload.secure_url,
            personImageId: personUpload.public_id,
            garmentImage: garmentUpload.secure_url,
            garmentImageId: garmentUpload.public_id,
            resultImage: finalResultUpload.secure_url,
            resultImageId: finalResultUpload.public_id,
            description
        });

        res.status(200).json(newTryOn);

    } catch (error) {
        console.error("TryOn Error:", error);
        res.status(500).json({
            message: "AI Processing Failed",
            error: error.message
        });
    }
};

const getTryOnHistory = async (req, res) => {
    try {
        const history = await TryOn.find({ user: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch history", error: error.message });
    }
};

const deleteTryOn = async (req, res) => {
    try {
        const tryOn = await TryOn.findById(req.params.id);
        if (!tryOn) return res.status(404).json({message: "Record not found"});
        if (tryOn.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({message: "Not authorized"});
        }
        if (tryOn.personImageId) {
            await cloudinary.uploader.destroy(tryOn.personImageId);
        }
        if (tryOn.garmentImageId) {
            await cloudinary.uploader.destroy(tryOn.garmentImageId);
        }

        const idsToDelete = [tryOn.personImageId, tryOn.garmentImageId, tryOn.resultImageId].filter(id => id);
        if (idsToDelete.length > 0) {
            await cloudinary.api.delete_resources(idsToDelete);
        }

        await tryOn.deleteOne();
        res.status(200).json({success: true, message: "History and all cloud assets deleted"});
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
};

module.exports = { generateTryOn, getTryOnHistory, deleteTryOn };