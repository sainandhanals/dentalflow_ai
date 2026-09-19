import { Router } from 'express';
import { AppointmentController } from '../controllers/appointment.controller';

const router = Router();

router.get('/', AppointmentController.getAll);
router.get('/:id', AppointmentController.getById);
router.post('/', AppointmentController.create);
router.patch('/:id', AppointmentController.update);
router.post('/:id/simulate-cancel', AppointmentController.simulateCancel);
router.delete('/:id', AppointmentController.delete);

export default router;
