import express from 'express';

import morgan from 'morgan';

import mongoose from 'mongoose';

import { loginValidation, registerValidation, postCreateValidation } from './validations.js';

import checkAuth from './utilities/checkAuth.js';

import * as userController from './Controllers/userController.js';
import * as postController from './Controllers/postController.js';

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
app.post('/auth/login', loginValidation, userController.login);
// REGISTRATION
app.post('/auth/register', registerValidation, userController.register);
// getMe
app.get('/auth/me', checkAuth, userController.getMe);

// СОЗДАНИЕ ПОСТА
app.get('/posts/:id', postController.getOne);
app.get('/posts', postController.getAll);
app.post('/posts', checkAuth, postCreateValidation, postController.create);
app.delete('/posts/:id', checkAuth, postController.remove);
app.patch('/posts/:id', postController.update);

app.listen(3000, () => {
  console.log('Server has been started on 3000 port!');
});
