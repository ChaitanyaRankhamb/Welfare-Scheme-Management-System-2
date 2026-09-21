import { schemeRepository } from '../../../database/repository/scheme.repository';
import { userRepository } from '../../../database/repository/user.repository';
import { UserId } from '../../../entity/user/userId';
import { AppError } from '../../../reuse-components/AppError';

/**
 * @description Publishes a drafted scheme
 */
export const publishSchemeService = async (userId: UserId, id: string) => {
  if (!userId) throw new AppError('Unauthorized', 401);

  const user = await userRepository.findUserById(userId.toString());

  if (!user) throw new AppError('User not found', 404);

  if (user.getRole() !== 'admin') {
    throw new AppError('Forbidden: Admin access required', 403);
  }

  const scheme = await schemeRepository.findSchemeById(id);

  if (!scheme) throw new AppError('Scheme not found', 404);

  // drafted → published
  // Updated scheme status system: active/deactive → drafted/published/archived
  if (scheme.getStatus() !== 'drafted') {
    throw new AppError('Only drafted schemes can be published', 400);
  }

  scheme.setStatus('published');
  const updated = await schemeRepository.updateScheme(id, scheme);

  return {
    success: true,
    data: updated,
    message: 'Scheme published successfully'
  };
};
