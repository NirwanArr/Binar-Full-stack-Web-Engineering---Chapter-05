const router = require("express").Router();

const Car = require("../controller/carController");

const upload = require("../middlewares/uploader");
const authenticate = require("../middlewares/authenticate");

router.post("/", authenticate, upload.single("image"), Car.createCar);
router.get("/", Car.findCars);
router.get("/:id", Car.findCarById);
router.patch("/:id", Car.UpdateCar);
router.delete("/:id", Car.deleteCar);

module.exports = router;