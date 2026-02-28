const cloudinaryMock = {
    uploader: {
        upload_stream: (options, callback) => {
            const mockStream = {
                end: (buffer) => {
                    // Simulate successful upload
                    callback(null, { secure_url: 'https://test-cloudinary.com/test-image.jpg' });
                }
            };
            return mockStream;
        }
    },
    config: () => {}
};

module.exports = cloudinaryMock;