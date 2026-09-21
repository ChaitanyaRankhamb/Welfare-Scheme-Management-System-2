"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthProvider = exports.ProviderType = void 0;
var ProviderType;
(function (ProviderType) {
    ProviderType["CREDENTIALS"] = "credentials";
    ProviderType["EMAIL"] = "email";
    ProviderType["GOOGLE"] = "google";
    ProviderType["GITHUB"] = "github";
})(ProviderType || (exports.ProviderType = ProviderType = {}));
class AuthProvider {
    type;
    providerId;
    constructor(type, providerId) {
        this.type = type;
        this.providerId = providerId;
    }
    static credentials(email) {
        return new AuthProvider(ProviderType.CREDENTIALS, email);
    }
    static google(id) {
        return new AuthProvider(ProviderType.GOOGLE, id);
    }
}
exports.AuthProvider = AuthProvider;
