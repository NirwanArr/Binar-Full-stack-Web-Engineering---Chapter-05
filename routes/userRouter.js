const router = require("express").Router();

const User = require("../controller/userController");

const authenticate = require("../middlewares/authenticate");
const checkRole = require("../middlewares/checkRole");
const checkId = require("../middlewares/checkId");
const checkOwner = require("../middlewares/checkOwner");

router.get("/", authenticate, User.findUsers);
router.get(
    "/:id",
    authenticate,
    checkRole(["superadmin", "admin"]),
    checkId,
    User.findUserById
);
router.patch(
    "/admin/:id",
    checkId,
    authenticate,
    checkRole(["super_admin"]),
    User.updateUser
);
router.delete(
    "/admin/:id",
    authenticate,
    checkId,
    checkRole(["super_admin"]),
    User.deleteUser
);

router.patch(
    "/member/:id",
    authenticate,
    checkOwner,
    User.updateUser
);
router.delete(
    "/member/:id",
    authenticate,
    checkId,
    checkRole(["superadmin", "admin"]),
    User.deleteUser
);

module.exports = router;
