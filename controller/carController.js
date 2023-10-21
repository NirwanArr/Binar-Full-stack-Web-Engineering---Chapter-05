const { Car, User } = require("../models");
const imagekit = require("../lib/imagekit");
const ApiError = require("../utils/apiError");
const { Op } = require("sequelize");

const createCar = async (req, res, next) => {
  const { name, price, category } = req.body;
  // const { username } = req.query;
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
      createByUserId: req.user.id,
      updateByUserId: req.user.id,
    });

    const createdByUser = await User.findByPk(req.user.id);

    res.status(200).json({
      status: "Success",
      data: {
        ...newCar.toJSON(),
        creator: createdByUser.name,
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
          as: 'createBy',
          attributes: ['name'],
          required: false,
        },
        {
          model: User,
          as: 'updateBy',
          attributes: ['name'],
          required: false,
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

const updateCar = async (req, res, next) => {
  const { name, price, category } = req.body;
  const file = req.file;

  try {
    let img;

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

    const [updatedRowCount, [updatedCar]] = await Car.update({
      name,
      price,
      category,
      image: img,
      updateByUserId: req.user.id,
    },
      {
        where: {
          id: req.params.id,
        },
        returning: true,
      }
    );

    if (updatedRowCount === 0) {
      return next(new ApiError("Car tidak ditemukan", 404));
    }

    const updateByUser = await User.findByPk(req.user.id);

    res.status(200).json({
      status: "Success",
      data: {
        ...updatedCar.toJSON(),
        updatedBy: updateByUser ? updateByUser.name : "Unknown User",
      },
      message: "Data berhasil diperbarui",
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

    await Car.update(
      {
        deletedBy: req.user.id,
      },

      {
        where: {
          id: req.params.id,
        },
      }
    );

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
  updateCar,
  deleteCar,
};
