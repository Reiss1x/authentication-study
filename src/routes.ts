import {Router} from 'express';
import {UserController} from './controllers/UserController'

const routes = Router()

routes.post('/user', new UserController().create);
routes.get('/user/:userId', new UserController().get);
routes.get('/user', new UserController().getAll);
routes.delete('/user/:userId', new UserController().delete);
export default routes