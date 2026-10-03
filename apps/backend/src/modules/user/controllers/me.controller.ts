import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../../../middlewares/auth.middleware";
import { userRepository } from "../../../database/repository/user.repository";

/**
 * Controller to get current user profile
 */
export const getMeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = (req as AuthRequest).user;
    if (!user) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to update current user profile (username or avatar)
 */
export const updateMeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as AuthRequest).userId;
    if (!userId) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }

    const user = await userRepository.findUserById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const body = req.body;

    if (body.username) user["username"] = body.username; // update properties
    if (body.avatar) user["avatar"] = body.avatar;

    // In actual implementation, we might map properties to the User Domain Entity methods like user.setUsername(body.username)
    // but the repo accepts the domain entity and saves it. For now, a naive update:
    // This calls the userRepository update function
    const updatedUser = await userRepository.updateUser(userId, user);

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
        avatar: updatedUser.getAvatar(),
      },
    });
  } catch (error) {
    next(error);
  }
};
