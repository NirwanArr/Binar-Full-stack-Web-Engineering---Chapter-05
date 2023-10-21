const router = require("express").Router();

const Car = require("../controller/carController");

const upload = require("../middlewares/uploader");
const authenticate = require("../middlewares/authenticate");
const checkRole = require("../middlewares/checkRole");


router.post("/", authenticate, checkRole("super_admin", "admin"), upload.single("image"), Car.createCar);
router.get("/", authenticate, Car.findCars);
router.get("/:id", authenticate, Car.findCarById);
router.patch("/:id", authenticate, checkRole("super_admin", "admin"), upload.single("image"), Car.updateCar);
router.delete("/:id", authenticate, checkRole("super_admin", "admin"), Car.deleteCar);

module.exports = router;