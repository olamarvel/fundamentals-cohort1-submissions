import { IUserCreated } from "../interfaces/IUserCreated";
import Cart from "../models/Cart";
import {publishToQueue} from "./connect"

export const handleUserCreated = async (userData: IUserCreated) => {
  const {event, data} = userData;
  var userId = data.userId
  console.log("user id" + userId.toString())

  // Check if cart exists already
  const existingCart = await Cart.findOne({userId});
  if (existingCart) {
    console.log(`ℹ️ Cart already exists for user: ${userId}`);
    return;
  }

  console.log("user id: " + JSON.stringify(userId))
  // Create empty cart
  const cart = new Cart({ userId, products: [] });
  await cart.save();
  publishToQueue("cart_events", {event: "CART_CREATED", data:{cartId: cart._id, userId}})

  console.log(`🛒 New cart created for user: ${userId}`);
};
