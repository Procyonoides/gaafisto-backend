import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { items, shippingAddress } = req.body;

    // Validasi stok produk
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }
    }

    // Hitung total
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      totalAmount += product!.price * item.quantity;
    }

    // Buat order
    const order = new Order({
      user: userId,
      items,
      totalAmount,
      shippingAddress,
      status: 'pending'
    });

    await order.save();

    // Kurangi stok produk
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const orders = await Order.find({ user: userId })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query: any = {};
    if (status) query.status = status;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'username email')
      .populate('items.product')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    res.json({
      orders,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'username email')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const requestUser = (req as any).user;
    const isOwner = order.user._id.toString() === requestUser.id;
    const isAdminOrSeller = requestUser.role === 'admin' || requestUser.role === 'seller';

    if (!isOwner && !isAdminOrSeller) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    const existingOrder = await Order.findById(req.params.id);
    if (!existingOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const wasCompleted = existingOrder.status === 'completed';
    const isNowCompleted = status === 'completed';

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    // Tambah 'sold' cuma sekali, pas status BERUBAH jadi completed
    // (bukan setiap kali endpoint ini dipanggil)
    if (!wasCompleted && isNowCompleted) {
      for (const item of existingOrder.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { sold: item.quantity }
        });
      }
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Only pending orders can be cancelled' 
      });
    }

    // Kembalikan stok produk
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getSellerOrders = async (req: Request, res: Response) => {
  try {
    const requestUser = (req as any).user;

    const myProducts = await Product.find({ seller: requestUser.id }).select('_id');
    const myProductIds = myProducts.map(p => p._id.toString());

    const orders = await Order.find({ 'items.product': { $in: myProductIds } })
      .populate('user', 'username email')
      .populate('items.product')
      .sort({ createdAt: -1 });

    const filteredOrders = orders.map(order => {
      const myItems = order.items.filter(item =>
        myProductIds.includes(item.product._id.toString())
      );
      const mySubtotal = myItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        _id: order._id,
        user: order.user,
        status: order.status,
        createdAt: order.createdAt,
        items: myItems,
        mySubtotal
      };
    });

    res.json({ orders: filteredOrders, total: filteredOrders.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};