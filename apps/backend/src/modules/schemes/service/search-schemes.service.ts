import { schemeRepository } from '../../../database/repository/scheme.repository';
import { userRepository } from '../../../database/repository/user.repository';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Searches for schemes based on keyword, category, and state
 * @param {string} userId - ID of the authenticated user
 * @param {any} criteria - Search criteria (keyword, category, state, pagination)
 * @returns {Promise<{ success: boolean; data: any; message: string }>}
 * @flow
 * 1. Validate userId presence
 * 2. Find user in database
 * 3. Construct search query
 * 4. Fetch matching schemes from repository
 * 5. Return structured response
 */
export const searchSchemesService = async (userId: string, criteria: any) => {
  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const { keyword, category, state, page = 1, limit = 10 } = criteria;
  
  // Only published schemes are visible to users
  // Updated scheme status system: active/deactive → drafted/published/archived
  const { schemes: allSchemes } = await schemeRepository.findAllSchemes({ status: 'published' }, 0, 1000);
  
  let filtered = allSchemes;
  
  if (keyword) {
    const q = keyword.toLowerCase();
    filtered = filtered.filter((s: any) => 
      s.getTitle().toLowerCase().includes(q) || 
      s.getDescription().toLowerCase().includes(q)
    );
  }
  
  if (category) {
    filtered = filtered.filter((s: any) => s.getCategory() === category);
  }
  
  if (state) {
    filtered = filtered.filter((s: any) => s.getState() === state);
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return {
    success: true,
    data: {
      schemes: paginated,
      total: filtered.length,
      page,
      limit
    },
    message: 'Schemes searched successfully'
  };
};
