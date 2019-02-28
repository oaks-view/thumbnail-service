const appRoot = require('app-root-path');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const { expect } = require('chai');
const sandbox = sinon.createSandbox();

describe('CoreService', () => {
    let coreService;

    beforeEach(() => {

        const imports = {
        }

        coreService = proxyquire(`${appRoot}/api/services/coreService`, imports);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('validatePatch sets isValid to false when "op" field is missing', () => {
        const payload = { path: '/foo', value: 'baz' };
        const result = coreService.validatePatch(payload);

        expect(result.isValid).equals(false);
        expect(result.missingFields.includes('op')).equals(true);
        expect(result.missingFields.includes('path')).equals(false);
    });

    it('validatePatch sets isValid to false when "path" field is missing', () => {
        const payload = { op: 'remove', value: 'baz' };
        const result = coreService.validatePatch(payload);

        expect(result.isValid).equals(false);
        expect(result.missingFields.includes('path')).equals(true);
        expect(result.missingFields.includes('op')).equals(false);
    });

    it('validatePatch sets isValid to false when "path" and "op" fields are missing', () => {
        const payload = { value: 'baz' };
        const result = coreService.validatePatch(payload);

        expect(result.isValid).equals(false);
        expect(result.missingFields.includes('path')).equals(true);
        expect(result.missingFields.includes('op')).equals(true);
    });

    it('validatePatch sets isValid to true when "path" and "op" fields are present', () => {
        const payload = { path: '/foo', op: 'remove' };
        const result = coreService.validatePatch(payload);

        expect(result.isValid).equals(true);
        expect(result.missingFields.includes('path')).equals(false);
        expect(result.missingFields.includes('op')).equals(false);
    });
});