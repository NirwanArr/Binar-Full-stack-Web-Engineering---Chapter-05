const { Car, User } = require("../models");
const imagekit = require("../lib/imagekit");
const ApiError = require("../utils/apiError");
const { Op } = require("sequelize");

const createCar = async (req, res, next) => {
  const { name, price, category } = req.body;
  const file = req.file;
  let img;

  try {
    if (file) {
      // dapatkan extension file nya
      const split = file.originalname.split(".");
      const extension = split[split.length - 1];

      // upload file ke imagekit
      const uploadedImage = await imagekit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${extension}`,
      });
      img = uploadedImage.url;
    }

    const newCar = await Car.create({
      name,
      price,
      category,
      image: img,
      userId: req.user.id,
    });

    res.status(200).json({
      status: "Success",
      data: {
        newCar,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

const findCars = async (req, res, next) => {
  try {
    const { carname, username } = req.query;
    const condition = {};
    if (carname) condition.name = { [Op.iLike]: `%${carname}%` };

    const includeUserCondition = {};
    if (username) includeUserCondition.name = { [Op.iLike]: `${username}%` };

    const cars = await Car.findAll({
      include: [
        {
          model: User,
          where: includeUserCondition,
        },
      ],
      where: condition,
      order: [["id", "ASC"]],
    });

    if (cars.length === 0) {
      return next(new ApiError("Data cars kosong", 404));
    }

    res.status(200).json({
      status: "Success",
      data: {
        cars,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

const findCarById = async (req, res, next) => {
  try {
    const car = await Car.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!car) {
      return next(new ApiError("Car id tersebut tidak ada", 404));
    }

    res.status(200).json({
      status: "Success",
      data: {
        car,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

const UpdateCar = async (req, res, next) => {
  const { name, price, category } = req.body;
  try {
    const car = await Car.update(
      {
        name,
        price,
        category,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    const carDataUpdated = await Car.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!carDataUpdated) {
      return next(new ApiError("Car id tersebut tidak ada", 404));
    }

    res.status(200).json({
      status: "Success",
      data: {
        carDataUpdated,
      },
      message: "Success update data",
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

const deleteCar = async (req, res, next) => {
  const { name, price, category } = req.body;
  try {
    const car = await Car.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!car) {
      next(new ApiError("Car id tersebut gak ada", 404));
    }

    await Car.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: "sukses delete data",
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
  }
};

module.exports = {
  createCar,
  findCars,
  findCarById,
  UpdateCar,
  deleteCar,
};