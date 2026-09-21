import { LocationModel } from '../mongo/models/location.model';

export class LocationRepository {
  async getStates(): Promise<string[]> {
    console.log("states repository hit");
    const states = await LocationModel.distinct('state');
    console.log("states", states);
    return states;
  }

  async getDistricts(state: string): Promise<string[]> {
    console.log("districts repository hit");
    const districts = await LocationModel.distinct('district', { state });
    console.log("districts", districts);
    return districts;
  }

  async getTalukas(district: string): Promise<string[]> {
    console.log("talukas repository hit");
    const talukas = await LocationModel.distinct('taluka', { district });
    console.log("talukas", talukas);
    return talukas;
  }

  async getVillages(taluka: string): Promise<string[]> {
    console.log("villages repository hit");
    const villages = await LocationModel.distinct('village', { taluka });
    console.log("villages", villages);
    return villages;
  }
}

export const locationRepository = new LocationRepository();
