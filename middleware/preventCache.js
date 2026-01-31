// Cache Control Middleware
// Source: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
module.exports = (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
// TODO: 4rr6hl 