import express from 'express';
import morgan from 'morgan';
import multer from 'multer';
import cors from 'cors';

import mongoose from 'mongoose';

import { loginValidation, registerValidation, postCreateValidation } from './validations.js';

import { checkAuth, handleValidationErrors } from './utilities/index.js';

import { userController, postController } from './Controllers/index.js';

mongoose
  .connect('mongodb+srv://admin:123@cluster0.tchem0o.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('DB connected succesfully!'))
  .catch((error) => console.log('DB connect Error', error));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/auth/login', loginValidation, handleValidationErrors, userController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, userController.register);
app.get('/auth/me', checkAuth, userController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/posts/:id', postController.getOne);
app.get('/posts', postController.getAll);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, postController.create);
app.delete('/posts/:id', checkAuth, postController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, postController.update);

app.listen(3000, () => {
  console.log('Server has been started on 3000 port!');
});
