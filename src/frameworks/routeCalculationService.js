const axios = require('axios');

class RouteCalculationService {
    constructor() {
        this.apiUrl = process.env.OPENROUTESERVICE_API_URL;
        this.apiKey = process.env.OPENROUTESERVICE_API_KEY;
    }

    async calculateRoute(startPointCoordinates, endPointCoordinates, routeOptions) {
        try {
            const body = {
                coordinates: [
                    [startPointCoordinates.lon, startPointCoordinates.lat],
                    [endPointCoordinates.lon, endPointCoordinates.lat]
                ],
                instructions: "false",
                options: {
                    avoid_features: [
                        ...(routeOptions.avoidTolls ? ['tollways'] : []),
                        ...(routeOptions.avoidHighways ? ['highways'] : [])
                    ]
                },
                units: "km"
            };

            const response = await axios.post(`${this.apiUrl}/v2/directions/driving-car`, body, {
                headers: {
                    'Authorization': this.apiKey,
                    'Content-Type': 'application/json; charset=utf-8'
                }
            });

            const route = response.data.routes[0];
            return {
                distance: route.summary.distance,
                duration: route.summary.duration
            };
        } catch (error) {
            console.error('Error calculating route:', error);
            throw error;
        }
    }
}

module.exports = RouteCalculationService;