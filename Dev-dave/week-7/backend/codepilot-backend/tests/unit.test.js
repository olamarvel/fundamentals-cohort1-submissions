import { getSampleProducts, createProductData } from "../controllers/productControllers.js";

describe("UNIT TESTS: product logic functions", () => {

  test("getSampleProducts should return an array with one sample product", () => {
    const products = getSampleProducts();

    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBe(1);
    expect(products[0]).toHaveProperty("id");
    expect(products[0]).toHaveProperty("name", "Sample Product");
  });

  test("createProductData should return an object with id and name", () => {
    const result = createProductData("Book");

    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("number"); 
    expect(result).toHaveProperty("name", "Book");
  });

});
