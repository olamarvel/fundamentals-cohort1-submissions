import User from "../models/User";

export const handleCartCreated = async (message: any) => {
  const { cartId, userId } = message.data;

  // Update user with cartId
  await User.findByIdAndUpdate(userId, { cartId });
  console.log(`🔗 Linked cart ${cartId} to user ${userId}`);
};