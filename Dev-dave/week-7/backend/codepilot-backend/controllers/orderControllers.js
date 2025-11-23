export const getOrders = (req, res) => {
  return res.status(200).json([{ id: 1, total: 500 }]);
};

export const createOrder = (req, res) => {
  const { total } = req.body;
  return res.status(201).json({ id: Date.now(), total });
};
