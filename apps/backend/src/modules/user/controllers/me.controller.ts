import { Request, Response, NextFunction } from "express";
import { User } from "../../../entity/user/user.entity";
import { userRepository } from "../../../database/repository/user.repository";

/**
 * Controller to get current user profile
 */
export const getMeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user as User;
    res.status(200).json({
      success: true,
      data: {
        id: user.id.toString(),
        email: user.getEmail(),
        username: user.getUsername(),
        avatar: user.getAvatar(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to update current user profile (username or avatar)
 */
export const updateMeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user as User;
    const body = req.body;
    
    if (body.username) user["username"] = body.username; // update properties
    if (body.avatar) user["avatar"] = body.avatar;
    
    // In actual implementation, we might map properties to the User Domain Entity methods like user.setUsername(body.username)
    // but the repo accepts the domain entity and saves it. For now, a naive update:
    // This calls the userRepository update function
    const updatedUser = await userRepository.updateUser(user.id.toString(), user);
    
    if (!updatedUser) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: updatedUser.id.toString(),
        email: updatedUser.getEmail(),
        username: updatedUser.getUsername(),
        avatar: updatedUser.getAvatar()
      }
    });

  } catch (error) {
    next(error);
  }
};
