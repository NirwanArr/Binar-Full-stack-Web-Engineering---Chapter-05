const ApiError = require("../utils/apiError");
const { User } = require("../models");

const checkId = async (req, res, next) => {
  try {
    const findUser = await User.findByPk(req.params.id);

    if (!findUser) {
      return next(new ApiError(`user tidak ditemukan`, 404));
    }
    next();
    
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

module.exports = checkId;
