import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import orderRoutes from './order.routes';
import recommendationRoutes from './recommendation.routes';
import categoryRoutes from './category.routes';
import profileRoutes from './profile.routes';
import contactRoutes from './contact.routes';
import shippingRoutes from './shipping.routes';
import statisticsRoutes from './statistics.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/categories', categoryRoutes);
router.use('/profile', profileRoutes);
router.use('/contact', contactRoutes);
router.use('/shipping', shippingRoutes);
router.use('/statistics', statisticsRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;