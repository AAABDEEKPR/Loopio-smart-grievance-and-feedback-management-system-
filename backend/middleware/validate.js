// Simple validation middleware to check for required fields
const validate = (fields) => {
    return (req, res, next) => {
        const missingFields = [];

        fields.forEach(field => {
            if (!req.body[field]) {
                missingFields.push(field);
            }
        });

        if (missingFields.length > 0) {
            res.status(400);
            throw new Error(`Please add missing fields: ${missingFields.join(', ')}`);
        }

        next();
    };
};

module.exports = { validate };
