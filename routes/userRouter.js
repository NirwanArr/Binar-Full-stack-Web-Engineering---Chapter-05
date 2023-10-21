const router = require("express").Router();

const User = require("../controller/userController");

const authenticate = require("../middlewares/authenticate");
const checkRole = require("../middlewares/checkRole");
const checkId = require("../middlewares/checkId");


router.get("/", authenticate, User.findUsers);
router.get("/:id", authenticate, checkId, User.findUserById);
router.patch(
    "/admin/:id",
    checkId,
    authenticate,
    checkRole("super_admin"),
    User.updateUser
);
router.delete("/admin/:id",
    authenticate,
    checkId,
    checkRole("super_admin"),
    User.deleteUser
);

router.patch(
    "/member/:id",
    authenticate,
    checkId,
    checkRole("super_admin"),
    User.updateUser
);
router.delete("/member/:id",
    authenticate,
    checkId,
    checkRole("super_admin"),
    User.deleteUser
);

module.exports = router;
