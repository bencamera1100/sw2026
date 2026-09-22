const products = [
  {
    id: 1,
    name: 'Laptop',
    price: 1200,
    stock: 10,
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    price: 25,
    stock: 50,
  },
  {
    id: 3,
    name: 'Mechanical Keyboard',
    price: 75,
    stock: 30,
  },
];

function findAll() {
  return products;
}

function findById(id) {
  return products.find((product) => product.id === Number(id));
}

function decreaseStock(id, quantity) {
  const product = findById(id);
  if (!product) {
    return null;
  }
  product.stock -= quantity;
  return product;
}

module.exports = {
  findAll,
  findById,
  decreaseStock,
};
