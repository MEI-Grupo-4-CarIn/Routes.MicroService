const axios = require("axios");

class RouteCalculationService {
  constructor() {
    this.apiUrl = process.env.OPENROUTESERVICE_API_URL;
    this.apiKey = process.env.OPENROUTESERVICE_API_KEY;
  }

  async calculateRoute(coordinates, routeOptions) {
    try {
      const body = {
        coordinates: coordinates,
        instructions: "false",
        options: {
          avoid_features: [...(routeOptions.avoidTolls ? ["tollways"] : []), ...(routeOptions.avoidHighways ? ["highways"] : [])],
        },
        units: "km",
      };

      const response = await axios.post(`${this.apiUrl}/v2/directions/driving-car`, body, {
        headers: {
          Authorization: this.apiKey,
          "Content-Type": "application/json; charset=utf-8",
        },
      });

      const route = response.data.routes[0];
      return {
        distance: route.summary.distance,
        duration: _convertSecondsToHoursAndMinutes(route.summary.duration),
      };
    } catch (error) {
      console.error("Error calculating route:", error);
      throw error;
    }
  }
}

function _convertSecondsToHoursAndMinutes(seconds) {
  // Calculate hours and remaining seconds
  var hours = Math.floor(seconds / 3600);
  var remainingSeconds = seconds % 3600;

  // Calculate minutes
  var minutes = Math.floor(remainingSeconds / 60);

  // Format hours and minutes as "HH:mm"
  var formattedHours = String(hours).padStart(2, "0");
  var formattedMinutes = String(minutes).padStart(2, "0");

  // Format hours and minutes as "HH:mm"
  var formattedTime = formattedHours + ":" + formattedMinutes;
  return formattedTime;
}

module.exports = RouteCalculationService;
