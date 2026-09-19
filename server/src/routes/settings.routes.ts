import { Router } from 'express';
import { SettingsController } from '../controllers/settings.controller';

const router = Router();

router.get('/settings', SettingsController.getSettings);
router.patch('/settings', SettingsController.updateSettings);

router.get('/workflows', SettingsController.getWorkflows);
router.post('/workflows', SettingsController.createWorkflow);
router.patch('/workflows/:id/toggle', SettingsController.toggleWorkflow);

export default router;
