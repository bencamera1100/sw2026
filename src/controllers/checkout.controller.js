const checkoutService = require('../services/checkout.service');

function checkout(req, res, next) {
  try {
    const result = checkoutService.checkout(req.body, req.user);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  checkout,
};
