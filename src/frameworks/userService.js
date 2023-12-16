const axios = require('axios');
const { generateJwt } = require('../utils/serviceJwtProvider');

class UserService {
    constructor() {
        this.apiUrl = process.env.AUTH_MICROSERVICE_API_URL;
    }

    async checkUserExists(userId) {
        // Generate a JWT with the JWT payload
        const payload = { service: 'Routes.MicroService' };
        const token = generateJwt(payload);

        try {
            const response = await axios.get(`${this.apiUrl}api/users/get-by-id/id=${userId}`, {
                headers: {
                    'Service-Authorization': `Bearer ${token}`
                }
            });
            return response.status === 200;
        } catch (error) {
            if (error.response) {
                console.error('Error checking user:', error.response.data.message);
                throw new Error('Error checking user: ' + error.response.data.message);
            }

            console.error('ERROR: User service is down or not responding.');
            throw new Error('User service is down or not responding.');
        }
    }
}

module.exports = UserService;