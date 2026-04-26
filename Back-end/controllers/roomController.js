// controllers/roomController.js
const { v4: uuidv4 } = require('uuid'); 

const createRoom = async (req, res) => {
    try {
        const roomId = uuidv4().substring(0, 8); 
        
        res.status(201).json({
            success: true,
            roomId: roomId,
            message: "Room created successfully. Share this ID with your friend!"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createRoom };