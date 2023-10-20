const router = require("express").Router();

const User = require("../controller/userController");

const upload = require("../middlewares/uploader");
const authenticate = require("../middlewares/authenticate");
const checkRole = require("../middlewares/checkRole");
const checkId = require("../middlewares/checkId");

router.get("/", authenticate, User.findUsers);
router.get("/:id", authenticate, User.findUserById);
router.patch(
    "/admin/:id",
    authenticate,
    checkRole("super_admin"),
    checkId,
    User.updateUser
);
router.delete("/admin/:id",
    authenticate,
    checkRole("super_admin"),
    checkId,
    User.updateUser
);

router.patch(
    "/member/:id",
    authenticate,
    checkId,
    User.updateUser
);
router.delete("/member/:id",
    authenticate,
    checkId,
    User.updateUser
);

module.exports = router;
