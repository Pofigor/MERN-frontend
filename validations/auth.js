import { body } from 'express-validator';

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть не меньше трех символов').isLength({ min: 3 }),
  body('name', 'Укажите имя').isLength({ min: 2 }),
  body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
];
