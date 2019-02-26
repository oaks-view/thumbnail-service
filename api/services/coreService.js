/**
 * @param {Object} payload json patch object to be validated
 */
exports.validatePatch = (payload) => {
    const requiredFields = ['op', 'path'];
    const result = {
        isValid: true,
        missingFields: []
    };

    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!payload[field]) {
            result.isValid = false;
            result.missingFields.push(field);
        }
    }
    
    return result;
}