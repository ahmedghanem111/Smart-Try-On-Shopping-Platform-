const { Client, handle_file } = require("@gradio/client");
const TryOn = require('../models/TryOn');
const User = require('../models/User')
const cloudinary = require('../config/cloudinary');

const generateTryOn = async (req, res) => {
    const { personImage, garmentImage, description, roomId } = req.body;

    try {
        if (global.io) {
            global.activeRequests = (global.activeRequests || 0) + 1;
            global.io.emit("admin:updateAnalytics", { 
                type: "NEW_REQUEST", 
                queueLength: global.activeRequests 
            });
        }

        const user = await User.findById(req.user._id);
        if (!user.height || !user.weight) {

            if (global.io) global.activeRequests--; 
            return res.status(400).json({
                success: false,
                message: "Profile Incomplete",
                error: "Please enter your height and weight in your profile."
            });
        }

        // إبلاغ الأدمن إن المعالجة بدأت فعلياً
        if (global.io) {
            global.io.emit("admin:updateAnalytics", {
                type: "TRYON_STARTED",
                user: user.name
            });
        }

        console.log("Uploading images to Cloudinary...📸");
        const personUpload = await cloudinary.uploader.upload(personImage, { folder: "fitme/people" });
        const garmentUpload = await cloudinary.uploader.upload(garmentImage, { folder: "fitme/garments" });

        console.log("Connecting to AI Engine...⏳");
        const app = await Client.connect("yisol/IDM-VTON", { token: process.env.HF_TOKEN });

        const result = await app.predict("/tryon", [
            { "background": handle_file(personUpload.secure_url), "layers": [], "composite": null },
            handle_file(garmentUpload.secure_url),
            description || "fashionable garment",
            true, true, 30, 42
        ]);

        const tempAiUrl = result.data[0].url;
        const finalResultUpload = await cloudinary.uploader.upload(tempAiUrl, { folder: "fitme/results" });

        const newTryOn = await TryOn.create({
            user: req.user._id,
            resultImage: finalResultUpload.secure_url,
            personImage: personUpload.secure_url,
            personImageId: personUpload.public_id,
            garmentImage: garmentUpload.secure_url,
            garmentImageId: garmentUpload.public_id,
            resultImageId: finalResultUpload.public_id,
            description
        });

    
        if (global.io) {
            if (roomId) {
                global.io.to(roomId).emit("tryOnCompleted", {
                    resultImage: finalResultUpload.secure_url,
                    byUser: user.name
                });
            } else {
                global.io.emit("tryOnCompleted", { resultImage: finalResultUpload.secure_url });
            }

        
            global.activeRequests = Math.max(0, global.activeRequests - 1); 
            global.io.emit("admin:updateAnalytics", { 
                type: "TRYON_SUCCESS", 
                queueLength: global.activeRequests,
                totalTryOns: 1
            });
        }
        
        res.status(200).json(newTryOn);

    } catch (error) {
        console.error("TryOn Error:", error);

        if (global.io) {
            global.activeRequests = Math.max(0, (global.activeRequests || 1) - 1);
            global.io.emit("admin:updateAnalytics", { 
                type: "TRYON_ERROR", 
                queueLength: global.activeRequests 
            });

            global.io.emit("admin:errorAlert", {
                user: req.user ? req.user.name : "Unknown",
                error: error.message,
                time: new Date()
            });
        }

        res.status(500).json({ message: "AI Processing Failed", error: error.message });
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