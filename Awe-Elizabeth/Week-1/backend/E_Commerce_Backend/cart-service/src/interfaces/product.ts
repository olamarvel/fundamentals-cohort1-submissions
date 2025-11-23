export interface ProductResponse {
  success: boolean,
  message: string,
  result: Product
}

interface Product{
    _id: string,
    name: string,
    description: string,
    price: number,
    category: string,
    stock: number
}