const router = require("express").Router();

const authenticate = require("../middlewares/authenticate");
const Auth = require("../controller/authController");
const checkRole = require("../middlewares/checkRole");

router.post("/superadmin/login", Auth.login);

router.post("/admin/register", authenticate, checkRole("super_admin"), Auth.register);
router.post("/admin/login", Auth.login);

router.post("/member/register", Auth.register);
router.post("/member/login", Auth.login);

router.get("/me", authenticate, Auth.authenticate);

module.exports = router;
