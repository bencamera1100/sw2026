const productModel = require('../models/product.model');

const ALLOWED_PAYMENT_METHODS = ['cash', 'credit_card'];
const CASH_DISCOUNT_RATE = 0.1;

function createHttpError(status, message, details) {
  const error = new Error(message);
  error.status = status;
  error.details = details;
  return error;
}

function checkout({ items, paymentMethod }, user) {
  if (!ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
    throw createHttpError(
      400,
      'Checkout accepts only cash or credit_card as payment method.',
    );
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw createHttpError(400, 'items must be a non-empty array.');
  }

  const lineItems = items.map((item, index) => {
    const productId = Number(item.productId);
    const quantity = Number(item.quantity);

    if (!Number.isInteger(productId) || !Number.isInteger(quantity) || quantity < 1) {
      throw createHttpError(
        400,
        `Invalid item at index ${index}: productId and a positive integer quantity are required.`,
      );
    }

    const product = productModel.findById(productId);
    if (!product) {
      throw createHttpError(404, `Product ${productId} was not found.`);
    }

    if (product.stock < quantity) {
      throw createHttpError(
        400,
        `Insufficient stock for ${product.name}. Available: ${product.stock}.`,
      );
    }

    return {
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      quantity,
      subtotal: product.price * quantity,
    };
  });

  const subtotal = lineItems.reduce((sum, line) => sum + line.subtotal, 0);
  const discount = paymentMethod === 'cash' ? Number((subtotal * CASH_DISCOUNT_RATE).toFixed(2)) : 0;
  const total = Number((subtotal - discount).toFixed(2));

  lineItems.forEach((line) => {
    productModel.decreaseStock(line.productId, line.quantity);
  });

  return {
    user: { id: user.id, name: user.name, email: user.email },
    paymentMethod,
    items: lineItems,
    subtotal,
    discount,
    discountRate: paymentMethod === 'cash' ? CASH_DISCOUNT_RATE : 0,
    total,
  };
}

module.exports = {
  checkout,
  ALLOWED_PAYMENT_METHODS,
};
