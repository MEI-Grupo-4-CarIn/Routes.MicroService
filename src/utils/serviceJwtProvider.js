const jwt = require('jsonwebtoken');

// Read the secret key from environment variables
const secret = process.env.SERVICE_SECRET_KEY;

// Function to generate a JWT
function generateJwt(payload) {
    const token = jwt.sign(payload, secret, { algorithm: 'HS256' });
    return token;
}

module.exports = { generateJwt };