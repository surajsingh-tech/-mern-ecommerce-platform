import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";
export const getCart = async (req, res) => {
  try {
    const userId = req.id;

    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "userId not found",
      });
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: [],
      });
    }
    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId, quantity } = req.body;
    const qty = Number(quantity) > 0 ? Number(quantity) : 1;

    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    if (!productId) {
      return res.status(404).json({
        success: false,
        message: "productId not found",
      });
    }

    //Check Product is exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "productId not found",
      });
    }

    //Find the user's cart (if exist )
    let cart = await Cart.findOne({ userId });

    // If cart doesn't exists, create a new one
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity: qty, price: product.productPrice }],
        totalPrice: product.productPrice,
      });
    } else {
      //find if product already in cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId.toString(),
      );
      if (itemIndex > -1) {
        //if Product exists -> just increase quantity
        cart.items[itemIndex].quantity += qty;
      } else {
        //if new product then push
        cart.items.push({
          productId,
          quantity: qty,
          price: product.productPrice,
        });
      }

      //Recalculate total Price
      cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + Number(item.price * item.quantity),
        0,
      );
    }
    //Save updated cart
    await cart.save();

    //Populate Product Details For Sending Response
    const populatedCart = await Cart.findById(cart._id).populate(
      "items.productId",
    );

    return res.status(200).json({
      success: true,
      message: "Product added  to cart successfully",
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const userId = req.id;
    const { productId, type } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId.toString(),
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (type === "increase") item.quantity += 1;
    if (type === "decrease" && item.quantity > 1) item.quantity -= 1;

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + Number(item.price * item.quantity),
      0,
    );

    await cart.save();
    cart = await cart.populate("items.productId");
    return res.status(200).json({
      success: true,
      message: "Quantity updated successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId.toString(),
    );

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + Number(item.price * item.quantity),
      0,
    );

    await cart.save();
    if (cart.items.length > 0) {
      cart = await cart.populate("items.productId");
    }
    return res.status(200).json({
      success: true,
      message: "item remove successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
