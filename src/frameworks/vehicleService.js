const axios = require('axios');
const { generateJwt } = require('../utils/serviceJwtProvider');

class VehicleService {
    constructor() {
        this.apiUrl = process.env.VEHICLE_MICROSERVICE_API_URL;
    }

    async checkVehicleExists(vehicleId) {
        // Generate a JWT with the JWT payload
        const payload = { service: 'Routes.MicroService' };
        const token = generateJwt(payload);

        try {
            const response = await axios.get(`${this.apiUrl}api/vehicles/${vehicleId}`, {
                headers: {
                    'Service-Authorization': `Bearer ${token}`
                }
            });
            return response.status === 200;
        } catch (error) {
            if (error.response) {
                console.error('Error checking vehicle:', error.response.data.message);
                throw new Error('Error checking vehicle: ' + error.response.data.message);
            }

            console.error('ERROR: Vehicle service is down or not responding.');
            throw new Error('Vehicle service is down or not responding.');
        }
    }
}

module.exports = VehicleService;