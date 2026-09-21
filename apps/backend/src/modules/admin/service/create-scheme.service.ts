import { schemeRepository } from '../../../database/repository/scheme.repository';
import { userRepository } from '../../../database/repository/user.repository';
import { AppError } from '../../../reuse-components/AppError';
import { CreateSchemeData } from '../../../repository/scheme.repository';

/**
 * @description Creates a new scheme after checking for duplicates
 * @param {string} userId - ID of the authenticated user (admin)
 * @param {CreateSchemeData} data - Scheme data
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 * @flow
 * 1. Validate userId presence
 * 2. Find user in database
 * 3. Check if user is admin
 * 4. Check if a scheme with the same title already exists
 * 5. If exists, throw AppError (409)
 * 4. Create new scheme via repository
 * 5. Return structured response
 */
export const createSchemeService = async (userId: string, data: CreateSchemeData) => {
  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.getRole() !== 'admin') {
    throw new AppError('Forbidden: Admin access required', 403);
  }

  // Check for duplicate title
  const { schemes: existingSchemes } = await schemeRepository.findAllSchemes();
  const isDuplicate = existingSchemes.find((s: any) => s.getTitle() === data.title);
  
  if (isDuplicate) {
    throw new AppError('Scheme with this title already exists', 409);
  }

  // All new schemes start in 'drafted' status
  // Updated scheme status system: active/deactive → drafted/published/archived
  data.status = 'drafted';
  const newScheme = await schemeRepository.createScheme(data);

  return {
    success: true,
    data: newScheme,
    message: 'Scheme created successfully'
  };
};
