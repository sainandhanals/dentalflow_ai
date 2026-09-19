import { Router } from 'express';
import { EnquiryController } from '../controllers/enquiry.controller';

const router = Router();

router.get('/', EnquiryController.getAll);
router.get('/:id', EnquiryController.getById);
router.post('/', EnquiryController.create);
router.patch('/:id', EnquiryController.update);
router.delete('/:id', EnquiryController.delete);
router.post('/:id/classify', EnquiryController.classify);
router.post('/:id/notes', EnquiryController.addNote);

export default router;
