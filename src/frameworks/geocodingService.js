const axios = require('axios');

class GeocodingService {
    constructor() {
        this.apiUrl = process.env.OPENROUTESERVICE_API_URL;
        this.apiKey = process.env.OPENROUTESERVICE_API_KEY;
    }

    async getCoordinates(location) {
        try {
            const response = await axios.get(`${this.apiUrl}/geocode/search`, {
                params: {
                    text: location,
                    api_key: this.apiKey
                }
            });
            const coordinates = response.data.features[0].geometry.coordinates;
            return {
                lon: coordinates[0],
                lat: coordinates[1]
            };
        } catch (error) {
            console.error('Error getting coordinates:', error);
            throw error;
        }
    }
}

module.exports = GeocodingService;