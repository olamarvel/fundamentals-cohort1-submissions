import { Request, Response } from "express";
import Cart from "../models/Cart";
import axios from "axios";
import { ProductResponse } from "../interfaces/product";

// Get cart by userId
export const getCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({
      success: false,
      message: "Cart not found", 
      result: null 
    });
    res.status(200).json({
      success: true, 
      message: "successful",
      result: cart
    });
  } catch (err) {
    res.status(500).json({success: true, message: "Error fetching cart", error: err });
  }
};

// Add product to cart
export const addToCart = async (req: Request, res: Response) => {
  const PRODUCT_SERVICE_URL = "http://localhost:5004/api/v1/products"
  try {
    const { userId, productId, quantity } = req.body;
    if(!userId || !productId || !quantity){
      return res.status(400).json({success: false, message: "userId, productId and quantity is required"})
    }

    const productRes = await axios.get<ProductResponse>(`${PRODUCT_SERVICE_URL}/${productId}`, {validateStatus: () => true});
    const product = productRes.data.result;

    if (!product) {
      return res.status(404).json({success: false, message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: "Not enough stock available" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    const existingItem = cart.products.find((p) => p.productId.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.products.push({ productId, quantity, price: product.price, productName: product.name });
    }

    await cart.save();
    res.status(200).json({success: true, message: "successful", result:cart});
  } catch (err) {
    res.status(500).json({ success: false, message: "Error adding to cart", error: err });
  }
};

// Update quantity of a product
export const updateQuantity = async (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.products.find((p) => p.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: "Product not in cart" });

    item.quantity = quantity;
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error updating quantity", error: err });
  }
};

// Remove product from cart
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter((p) => p.productId.toString() !== productId);
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error removing from cart", error: err });
  }
};
