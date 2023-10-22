const ApiError = require("../utils/apiError");

const checkOwner = (req, res, next) => {
    if (req.user.id != req.params.id)
        return next(
            new ApiError(
                "kamu bukan pemilik akun ini",
                401
            )
        );
    next();
};

module.exports = checkOwner;
