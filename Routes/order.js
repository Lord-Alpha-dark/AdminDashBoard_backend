const express = require('express');
const router = express.Router();
const Order = require('../Models/order');

router.get('/', async function (req, res) {
    try {
        const allorders = await Order.find()
            .populate('Coupon', 'id name discountAmount status')
            .populate('userId', 'id name').sort({ _id: -1 });;

        res.json({ success: true, message: "Orders retrieved successfully.", data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:id', async function (req, res) {
    try {
        const orders = await Order.findById(req.params.id)
            .populate('Coupon', 'id name discountAmount status')
            .populate('userId', 'id name').sort({ _id: -1 });;

        if (!orders) {
            return res.status(404).json({ success: false, message: "orders not found" });
        }
        res.json({ success: true, message: "Orders retrieved successfully.", data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/order', async function (req, res) {
    const { userId, orderDate, orderStatus, items, totalPrice, shippingAddress, paymentMethod, couponCode, orderTotal, trackingUrl } = req.body;
    if (!userId || !items || !totalPrice || !shippingAddress || !paymentMethod || !orderTotal) {
        return res.status(400).json({ success: false, message: "User ID, items, totalPrice, shippingAddress, paymentMethod, and orderTotal are required." });
    }

    try {
        const order = new Order({ userId, orderDate, orderStatus, items, totalPrice, shippingAddress, paymentMethod, couponCode, orderTotal, trackingUrl });
        const newOrder = await order.save();
        res.json({ success: true, message: "Order created successfully.", data: null });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/update/:id', async function (req, res) {
    try {
        const orderID = req.params.id;
        const { orderStatus, trackingUrl } = req.body;
        if (!orderStatus) {
            return res.status(400).json({ success: false, message: "Order Status required." });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderID,
            { orderStatus, trackingUrl },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        res.json({ success: true, message: "Order updated successfully.", data: null });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete an order
router.delete('/delete/:id', async function (req, res) {
    try {
        const orderID = req.params.id;

        const deletedOrder = await Order.findByIdAndDelete(orderID);
        if (!deletedOrder) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }
        res.json({ success: true, message: "Order deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;

