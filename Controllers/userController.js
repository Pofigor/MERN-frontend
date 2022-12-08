import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import UserModel from '../db/models/User.js';

export const register = async (req, res) => {
  try {
    const errors = validationResult(req); // на гите этого нет
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const { password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      passwordHash: hash,
      name: req.body.name,
      avatarUrl: req.body.avatarUrl,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret-string',
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log('ERROR REGISTER USER', error);
    res.status(500).json({
      message: 'Не удалось зарегистрироваться!',
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    // проверяем пользователя
    if (!user) {
      return res.status(404).json({ // 404 - Not found
        message: 'Пользователь не найден',
      });
    }

    // проверяем пароль
    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPass) {
      return res.status(400).json({ // 400 Bad request
        message: 'Неверный логин, или пароль',
      });
    }
    // создаем новый токен в случае успеха валидации
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret-string',
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log('ERROR LOGIN USER', error);
    res.status(500).json({
      message: 'Не удалось авторизоваться!',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (error) {
    console.log('ERROR AUTH/ME', error);
    res.status(500).json({
      message: 'Нет доступа',
    });
  }
};
