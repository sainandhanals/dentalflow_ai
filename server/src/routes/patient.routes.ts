import { Router } from 'express';
import { PatientController } from '../controllers/patient.controller';

const router = Router();

router.get('/', PatientController.getAll);
router.get('/:id', PatientController.getById);
router.post('/', PatientController.create);
router.patch('/:id', PatientController.update);
router.delete('/:id', PatientController.delete);
router.post('/:id/notes', PatientController.addNote);
router.post('/:id/interactions', PatientController.addInteraction);

export default router;
