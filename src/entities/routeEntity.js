exports.RouteEntity = class RouteEntity {
    constructor(data) {
        const fields = RouteEntity.getFields();
        fields.forEach(field => {
            this[field] = data[field];
        });
    }

    static getFields() {
        return ['userId',
            'vehicleId',
            'startPoint',
            'endPoint',
            'startDate',
            'distance',
            'duration',
            'status',
            'avoidTolls',
            'avoidHighways'];
    }

    async validator() {
        const errors = [];
        
        const fields = RouteEntity.getFields();
        for (let field of fields) {
            if (this[field] !== undefined && (this[field] === null || this[field] === '')) {
                errors.push(`${field} cannot be null or empty`);
            }
        }

        if (typeof this.startPoint.city !== 'string' || typeof this.startPoint.country !== 'string' ||
            !Array.isArray(this.startPoint.coordinates) || this.startPoint.coordinates.length !== 2 ||
            !this.startPoint.coordinates.every(Number.isFinite)) {
            errors.push('Invalid startPoint. City, country, and coordinates (as an array of two numbers) are required.');
        }
        if (typeof this.endPoint.city !== 'string' || typeof this.endPoint.country !== 'string' ||
            !Array.isArray(this.endPoint.coordinates) || this.endPoint.coordinates.length !== 2 ||
            !this.endPoint.coordinates.every(Number.isFinite)) {
            errors.push('Invalid endPoint. City, country, and coordinates (as an array of two numbers) are required.');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}