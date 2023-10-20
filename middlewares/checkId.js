const ApiError = require("../utils/apiError");
const { User } = require("../models");

const checkId = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return next(new ApiError(`user tidak ditemukan`, 404));
    }

    if (user.id === req.user.id || req.user.role == "super_admin") {
      next();
    } else {
      return next(new ApiError(`Tidak diizinkan, kamu bukan pemilik akun ini`, 403));
    }
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

module.exports = checkId;
