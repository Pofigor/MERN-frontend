import express from 'express';

import morgan from 'morgan';

import mongoose from 'mongoose';

import { registerValidation } from './validations/auth.js';

import checkAuth from './utilities/checkAuth.js';

mongoose
  .connect('mongodb+srv://admin:123@cluster0.tchem0o.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('DB connected succesfully!'))
  .catch((error) => console.log('DB connect Error', error));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});
// LOG IN
app.post('/auth/login');

// REGISTRATION
app.post('/auth/register', registerValidation);

app.get('/auth/me', checkAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json({ userData });
  } catch (error) {
    console.log('ERROR AUTH/ME', error);
    res.status(500).json({
      message: 'Нет доступа',
    });
  }
});

app.listen(3000, () => {
  console.log('Server has been started on 3000 port!');
});
