import { Router } from 'express';
import { FollowUpController } from '../controllers/followUp.controller';

const router = Router();

router.get('/', FollowUpController.getAll);
router.get('/:id', FollowUpController.getById);
router.post('/', FollowUpController.create);
router.patch('/:id', FollowUpController.update);
router.post('/:id/complete', FollowUpController.complete);
router.delete('/:id', FollowUpController.delete);

export default router;
