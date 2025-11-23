import { Router } from "express";
import { getCart, addToCart, removeFromCart } from "../controllers/cartController";

const router = Router();

router.get("/get-cart/:userId", getCart);
router.post("/add-to-cart", addToCart);
router.post("/remove-product/:userId/:productId", removeFromCart);


export default router;