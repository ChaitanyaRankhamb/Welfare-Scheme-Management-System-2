"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationRepository = exports.LocationRepository = void 0;
const location_model_1 = require("../mongo/models/location.model");
class LocationRepository {
    async getStates() {
        console.log("states repository hit");
        const states = await location_model_1.LocationModel.distinct('state');
        console.log("states", states);
        return states;
    }
    async getDistricts(state) {
        console.log("districts repository hit");
        const districts = await location_model_1.LocationModel.distinct('district', { state });
        console.log("districts", districts);
        return districts;
    }
    async getTalukas(district) {
        console.log("talukas repository hit");
        const talukas = await location_model_1.LocationModel.distinct('taluka', { district });
        console.log("talukas", talukas);
        return talukas;
    }
    async getVillages(taluka) {
        console.log("villages repository hit");
        const villages = await location_model_1.LocationModel.distinct('village', { taluka });
        console.log("villages", villages);
        return villages;
    }
}
exports.LocationRepository = LocationRepository;
exports.locationRepository = new LocationRepository();
