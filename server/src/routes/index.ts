import { Router } from 'express';
import healthRoutes from './health.routes';
import patientRoutes from './patient.routes';
import enquiryRoutes from './enquiry.routes';
import appointmentRoutes from './appointment.routes';
import followUpRoutes from './followUp.routes';
import aiRoutes from './ai.routes';
import analyticsRoutes from './analytics.routes';
import settingsRoutes from './settings.routes';

const router = Router();

router.use('/', healthRoutes);
router.use('/patients', patientRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/follow-ups', followUpRoutes);
router.use('/', aiRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/', settingsRoutes);

export default router;
