import { User } from "../models/user.model.js"

export const getAllUsers = async (req, res) => {
  try {
    const { verify, role, username } = req.query;

    const filter = {};
    if (verify === String(true) || verify === String(false)) filter.isVerifide = verify; 
    if (role) filter.role = role;
    if (username) filter.username = username;

    console.log(filter)

    const users = await User.find(filter, 'username email role lastLoginDate isVerifide');
    return res.status(200).json({
      success: true,
      users:users,
      message: "Usernames retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch usernames",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOneAndDelete({ _id: userId,role:"user" });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `User ${user.username} deleted successfully`,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch usernames",
      error: error.message,
    });
  }
};

export const patchUserRole = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOneAndUpdate(
      { _id: userId, role: "user",isVerifide: true},
      { role: "admin" },
      { new: true } 
    );

    console.log(user)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `User ${user.username} updated to ${user.role} successfully`,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch usernames",
      error: error.message,
    });
  }
};