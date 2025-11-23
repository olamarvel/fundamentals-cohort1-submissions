import { Request, Response } from "express";
import Product from "../models/Product";

// Create Product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {name, description, price, stock, category} = req.body
    if(!name || !price || !stock){
        res.status(400).json({message: "product name, price and stock is required"});
    }
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(" Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json({success: true, message: "successful", result: products})
  } catch (error) {
    console.error(" Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Available Products
export const getAvailableProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ stock: { $gt: 1 } });
    res.status(200).json({success: true, message: "successful", result: products})
  } catch (error) {
    console.error(" Error fetching products:", error);
    res.status(500).json({success: false, message: "Internal server error" });
  }
};

// Get Single Product
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({success: false, message: "Product not found" });
    res.status(200).json({success: true, message: "successful", result: product})
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
