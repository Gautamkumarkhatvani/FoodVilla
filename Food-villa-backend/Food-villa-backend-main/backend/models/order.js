// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
//   {

//     customer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Customer",
//       required: true,
//     },

   
//     items: [
//       {
//         productId: {
//           type: mongoose.Schema.Types.ObjectId,
//           required: true,
//         },
//         title: {
//           type: String,
//           required: true,
//         },
//         price: {
//           type: Number,
//           required: true,
//         },
//         qty: {
//           type: Number,
//           required: true,
//           min: 1,
//           max: 5,
//         },
//       },
//     ],


//     totalAmount: {
//       type: Number,
//       required: true,
//     },

//     customerName: {
//       type: String,
//       required: true,
//     },

//     email: {
//       type: String,
//       required: true,
//     },

//     mobile: {
//       type: String,
//       required: true,
//     },

//     address: {
//       fullAddress: {
//         type: String,
//         required: true,
//       },
//       city: String,
//       state: String,
//       pincode: String,
//     },

//     location: {
//       latitude: Number,
//       longitude: Number,
//     },
//     paymentMethod: {
//       type: String,
//       enum: ["COD"],
//       default: "COD",
//     },

//     /* 🔥 STATUS */
//     status: {
//   type: String,
//   enum: [
//     "pending",
//     "confirmed",
//     "out_for_delivery",
//     "delivered",
//     "cancelled",
//   ],
//   default: "pending",
// },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Order", orderSchema);
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        title: String,
        price: Number,
        qty: {
          type: Number,
          min: 1,
          max: 5,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    customerName: String,
    email: String,
    mobile: String,

    address: {
      fullAddress: String,
      city: String,
      state: String,
      pincode: String,
    },

    location: {
      latitude: Number,
      longitude: Number,
    },

    paymentMethod: {
      type: String,
      enum: ["COD"],
      default: "COD",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending", // ✅ IMPORTANT
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);