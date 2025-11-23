export const login = (req, res) => {
  return res.status(200).json({ message: "Login successful" });
};

export const register = (req, res) => {
  return res.status(201).json({ message: "Registration successful" });
};
