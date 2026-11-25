import Order from "../models/order.js";
import Customer from "../models/customer.js";
import Taste from "../models/Taste.js";

/* CREATE ORDER (COD - Logged in Customer) */
export const createOrder = async (req, res) => {
  try {
    const customerId = req.user?.id;

    if (!customerId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const {
      fullName,
      mobile,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      items,
      totalAmount,
    } = req.body;

    /* VALIDATION */
    if (!fullName || !mobile || !address || !city || !pincode) {
      return res.status(400).json({
        message: "All checkout details are required",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const order = await Order.create({
      customer: customer._id,        
      email: customer.email,         
      items,
      totalAmount,
      customerName: fullName,
      mobile,
      address: {
        fullAddress: address,       
        city,
        state,
        pincode,
      },
      location: {
        latitude,
        longitude,
      },
      status: "confirmed",           
    });
     for (const item of items) {
      await Taste.findByIdAndUpdate(
        item.productId,
        { $inc: { orderCount: item.qty } }
      );
    }

    return res.status(201).json({
      message: "Order confirmed (Cash on Delivery)",
      order,
    });

  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    return res.status(500).json({
      message: "Order creation failed",
    });
  }
};

/*
   GET CUSTOMER ORDERS*/
export const getUserOrders = async (req, res) => {
  try {
    const customerId = req.user?.id;

    if (!customerId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const orders = await Order.find({
      customer: customerId,
    }).sort({ createdAt: -1 });

    return res.json(orders);

  } catch (error) {
    console.error("GET USER ORDERS ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};

/* CANCEL ORDER */
export const cancelOrder = async (req, res) => {
  try {
    const customerId = req.user?.id;
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.customer.toString() !== customerId) {
      return res.status(403).json({
        message: "You cannot cancel this order",
      });
    }

    if (order.status !== "confirmed") {
      return res.status(400).json({
        message: "Order cannot be cancelled now",
      });
    }

    order.status = "cancelled";
    await order.save();

    return res.json({
      message: "Order cancelled successfully",
      order,
    });

  } catch (error) {
    console.error("CANCEL ORDER ERROR:", error);
    return res.status(500).json({
      message: "Cancel failed",
    });
  }
};

/* ADMIN - GET ALL ORDERS */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email mobile")
      .sort({ createdAt: -1 });

    return res.json(orders);

  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch all orders",
    });
  }
};

/* ADMIN - UPDATE STATUS */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

   const allowedStatus = [
  "pending",
  "confirmed",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.json({
      message: "Order status updated",
      order,
    });

  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);
    return res.status(500).json({
      message: "Status update failed",
    });
  }
};
