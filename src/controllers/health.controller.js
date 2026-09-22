function healthcheck(req, res) {
  res.status(200).json({
    status: 'ok',
    service: 'sw2026-ecommerce-api',
    timestamp: new Date().toISOString(),
  });
}

module.exports = {
  healthcheck,
};
