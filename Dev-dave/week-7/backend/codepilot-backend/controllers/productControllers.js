// pure logic function (unit testable)
export const getSampleProducts = () => {
  return [{ id: 1, name: "Sample Product" }];
};

// controller (integration test)
export const getProducts = (req, res) => {
  return res.status(200).json(getSampleProducts());
};


// pure logic
export const createProductData = (name) => {
  return { id: Date.now(), name };
};

// controller
export const createProduct = (req, res) => {
  const { name } = req.body;
  return res.status(201).json(createProductData(name));
};
