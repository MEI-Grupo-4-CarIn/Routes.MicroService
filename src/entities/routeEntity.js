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
            'status'];
    }

    async validator() {
        const errors = [];
        
        const fields = RouteEntity.getFields();
        for (let field of fields) {
            if (this[field] !== undefined && (this[field] === null || this[field] === '')) {
                errors.push(`${field} cannot be null or empty`);
            }
        }

        if (typeof this.startPoint.city !== 'string' || typeof this.startPoint.country !== 'string') {
            errors.push('Invalid startPoint. City and country are required.');
        }
        if (typeof this.endPoint.city !== 'string' || typeof this.endPoint.country !== 'string') {
            errors.push('Invalid endPoint. City and country are required.');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}