import { Response } from 'express';
import { AuthRequest } from '../../../middlewares/auth.middleware';
import { updateProfileService } from '../service/update-profile.service';
import { profileValidationSchema } from '../../../validations/profile/profile.validation';
import { successResponse, errorResponse } from '../../../reuse-components/response';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Controller to update the authenticated user's profile
 * @param {AuthRequest} req - Authenticated request
 * @param {Response} res - Express response
 */
export const updateProfileController = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req;
    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { section, data } = req.body;
    if (!section || !data) {
      throw new AppError('Section and data are required', 400);
    }

    // Allow partial updates for PUT while maintaining structural validity
    const updateSchema = profileValidationSchema.deepPartial();
    const validation = updateSchema.safeParse({ body: data });
    
    if (!validation.success) {
      throw new AppError(validation.error.errors[0].message, 400);
    }

    const validatedData = validation.data?.body || {};
    const updateObject: any = {};

    switch (section) {
      case "personalInfo":
      case "personalInformation":
        if (validatedData.firstName) updateObject.firstName = validatedData.firstName;
        if (validatedData.middleName !== undefined) updateObject.middleName = validatedData.middleName;
        if (validatedData.lastName) updateObject.lastName = validatedData.lastName;
        if (validatedData.gender) updateObject.gender = validatedData.gender;
        if (validatedData.dateOfBirth) updateObject.dateOfBirth = validatedData.dateOfBirth;
        if (validatedData.mobileNumber) updateObject.mobileNumber = validatedData.mobileNumber;
        if (validatedData.alternateContact !== undefined) updateObject.alternateContact = validatedData.alternateContact;
        break;

      case "address":
      case "addressDetails":
        if (validatedData.country) updateObject.country = validatedData.country;
        if (validatedData.state) updateObject.state = validatedData.state;
        if (validatedData.district) updateObject.district = validatedData.district;
        if (validatedData.taluka !== undefined) updateObject.taluka = validatedData.taluka;
        if (validatedData.village !== undefined) updateObject.village = validatedData.village;
        if (validatedData.pincode) updateObject.pincode = validatedData.pincode;
        if (validatedData.areaType) updateObject.areaType = validatedData.areaType;
        break;

      case "socioEconomic":
        if (validatedData.annualIncome !== undefined) updateObject.annualIncome = validatedData.annualIncome;
        if (validatedData.incomeCategory !== undefined) updateObject.incomeCategory = validatedData.incomeCategory;
        if (validatedData.bplStatus !== undefined) updateObject.bplStatus = validatedData.bplStatus;
        if (validatedData.casteCategory) updateObject.casteCategory = validatedData.casteCategory;
        if (validatedData.religion) updateObject.religion = validatedData.religion;
        if (validatedData.rationCardType !== undefined) updateObject.rationCardType = validatedData.rationCardType;
        break;

      case "education":
        if (validatedData.educationLevel !== undefined) updateObject.educationLevel = validatedData.educationLevel;
        if (validatedData.institutionName !== undefined) updateObject.institutionName = validatedData.institutionName;
        if (validatedData.course !== undefined) updateObject.course = validatedData.course;
        if (validatedData.stream !== undefined) updateObject.stream = validatedData.stream;
        if (validatedData.boardUniversity !== undefined) updateObject.boardUniversity = validatedData.boardUniversity;
        if (validatedData.admissionYear !== undefined) updateObject.admissionYear = validatedData.admissionYear;
        if (validatedData.passingYear !== undefined) updateObject.passingYear = validatedData.passingYear;
        if (validatedData.resultType !== undefined) updateObject.resultType = validatedData.resultType;
        if (validatedData.resultValue !== undefined) updateObject.resultValue = validatedData.resultValue;
        if (validatedData.educationMode !== undefined) updateObject.educationMode = validatedData.educationMode;
        break;

      case "professional":
        if (validatedData.occupationType !== undefined) updateObject.occupationType = validatedData.occupationType;
        if (validatedData.employmentStatus !== undefined) updateObject.employmentStatus = validatedData.employmentStatus;
        if (validatedData.laborType !== undefined) updateObject.laborType = validatedData.laborType;
        if (validatedData.skillLevel !== undefined) updateObject.skillLevel = validatedData.skillLevel;
        if (validatedData.yearsOfExperience !== undefined) updateObject.yearsOfExperience = validatedData.yearsOfExperience;
        break;

      case "agriculture":
        if (validatedData.landSize !== undefined) updateObject.landSize = validatedData.landSize;
        if (validatedData.cropType !== undefined) updateObject.cropType = validatedData.cropType;
        if (validatedData.irrigationType !== undefined) updateObject.irrigationType = validatedData.irrigationType;
        break;

      default:
        // Allow general save without switch constraints, if preferred. Or strictly reject.
        return res.status(400).json({ message: "Invalid section" });
    }

    if (Object.keys(updateObject).length === 0) {
      throw new AppError('No valid data provided to update', 400);
    }

    const result = await updateProfileService(userId, updateObject);
    return res.status(200).json({
      success: true,
      message: `${section.charAt(0).toUpperCase() + section.slice(1).replace(/([A-Z])/g, ' $1')} section updated successfully`,
      data: result.data
    });
  } catch (error: any) {
    return errorResponse(res, error.message || 'Error updating profile section', error.statusCode || 500);
  }
};
