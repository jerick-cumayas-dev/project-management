import express from 'express'
import { UserController } from '../controllers/user_controller'

const router = express.Router();
const userController = new UserController();

router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUser);
router.post('/users', userController.createUser);
router.patch('/users/:id', userController.updateUser);

export default router;