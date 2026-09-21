import { IProfileRepository, CreateProfileData } from '../../repository/profile.repository';
import { ProfileId } from '../../entity/profile/profileId';
import { UserId } from '../../entity/user/userId';
import { ProfileModel } from '../mongo/models/profile.model';
import { Profile } from '../../entity/profile/profile.entity';

export class ProfileModelRepo implements IProfileRepository {

  private mapToDomain(doc: any): Profile {
    return new Profile(
      new ProfileId(doc._id.toString()),
      {
        userId: new UserId(doc.userId.toString()),
        firstName: doc.firstName,
        middleName: doc.middleName,
        lastName: doc.lastName,
        gender: doc.gender,
        dateOfBirth: doc.dateOfBirth,
        mobileNumber: doc.mobileNumber,
        alternateContact: doc.alternateContact,
        country: doc.country,
        state: doc.state,
        district: doc.district,
        taluka: doc.taluka,
        village: doc.village,
        pincode: doc.pincode,
        areaType: doc.areaType,
        annualIncome: doc.annualIncome,
        incomeCategory: doc.incomeCategory,
        bplStatus: doc.bplStatus,
        casteCategory: doc.casteCategory,
        religion: doc.religion,
        rationCardType: doc.rationCardType,
        educationLevel: doc.educationLevel,
        institutionName: doc.institutionName,
        course: doc.course,
        stream: doc.stream,
        boardUniversity: doc.boardUniversity,
        admissionYear: doc.admissionYear,
        passingYear: doc.passingYear,
        resultType: doc.resultType,
        resultValue: doc.resultValue,
        educationMode: doc.educationMode,
        occupationType: doc.occupationType,
        employmentStatus: doc.employmentStatus,
        laborType: doc.laborType,
        skillLevel: doc.skillLevel,
        yearsOfExperience: doc.yearsOfExperience,
        landSize: doc.landSize,
        cropType: doc.cropType || [],
        irrigationType: doc.irrigationType,
        profileCompletionPercentage: doc.profileCompletionPercentage,
      },
      doc.createdAt,
      doc.updatedAt
    );
  }

  async createProfile(data: CreateProfileData): Promise<Profile> {
    const newDoc = new ProfileModel({
      userId: data.userId,
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      mobileNumber: data.mobileNumber,
      alternateContact: data.alternateContact,
      country: data.country,
      state: data.state,
      district: data.district,
      taluka: data.taluka,
      village: data.village,
      pincode: data.pincode,
      areaType: data.areaType,
      annualIncome: data.annualIncome,
      incomeCategory: data.incomeCategory,
      bplStatus: data.bplStatus,
      casteCategory: data.casteCategory,
      religion: data.religion,
      rationCardType: data.rationCardType,
      educationLevel: data.educationLevel,
      institutionName: data.institutionName,
      course: data.course,
      stream: data.stream,
      boardUniversity: data.boardUniversity,
      admissionYear: data.admissionYear,
      passingYear: data.passingYear,
      resultType: data.resultType,
      resultValue: data.resultValue,
      educationMode: data.educationMode,
      occupationType: data.occupationType,
      employmentStatus: data.employmentStatus,
      laborType: data.laborType,
      skillLevel: data.skillLevel,
      yearsOfExperience: data.yearsOfExperience,
      landSize: data.landSize,
      cropType: data.cropType,
      irrigationType: data.irrigationType,
      profileCompletionPercentage: data.profileCompletionPercentage
    });

    const savedDoc = await newDoc.save();
    return this.mapToDomain(savedDoc);
  }

  async findProfileByUserId(userId: string): Promise<Profile | null> {
    const doc = await ProfileModel.findOne({ userId });
    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  async updateProfile(userId: string, profile: Profile): Promise<Profile | null> {
    const snapshot = profile.getSnapshot();
    const updatedDoc = await ProfileModel.findOneAndUpdate(
      { userId },
      {
        firstName: snapshot.firstName,
        middleName: snapshot.middleName,
        lastName: snapshot.lastName,
        gender: snapshot.gender,
        dateOfBirth: snapshot.dateOfBirth,
        mobileNumber: snapshot.mobileNumber,
        alternateContact: snapshot.alternateContact,
        country: snapshot.country,
        state: snapshot.state,
        district: snapshot.district,
        taluka: snapshot.taluka,
        village: snapshot.village,
        pincode: snapshot.pincode,
        areaType: snapshot.areaType,
        annualIncome: snapshot.annualIncome,
        incomeCategory: snapshot.incomeCategory,
        bplStatus: snapshot.bplStatus,
        casteCategory: snapshot.casteCategory,
        religion: snapshot.religion,
        rationCardType: snapshot.rationCardType,
        educationLevel: snapshot.educationLevel,
        institutionName: snapshot.institutionName,
        course: snapshot.course,
        stream: snapshot.stream,
        boardUniversity: snapshot.boardUniversity,
        admissionYear: snapshot.admissionYear,
        passingYear: snapshot.passingYear,
        resultType: snapshot.resultType,
        resultValue: snapshot.resultValue,
        educationMode: snapshot.educationMode,
        occupationType: snapshot.occupationType,
        employmentStatus: snapshot.employmentStatus,
        laborType: snapshot.laborType,
        skillLevel: snapshot.skillLevel,
        yearsOfExperience: snapshot.yearsOfExperience,
        landSize: snapshot.landSize,
        cropType: snapshot.cropType,
        irrigationType: snapshot.irrigationType,
        profileCompletionPercentage: snapshot.profileCompletionPercentage
      },
      { new: true }
    );

    if (!updatedDoc) return null;
    return this.mapToDomain(updatedDoc);
  }
}

export const profileRepository = new ProfileModelRepo();
