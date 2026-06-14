const express = require('express');

const router = express.Router();

// GET /api/qr/vietqr-info?amount=xxx&description=xxx
router.get('/vietqr-info', (req, res) => {
  try {
    const { amount, description } = req.query;

    const accountNo = process.env.TECHCOMBANK_ACCOUNT_NO;
    const accountName = process.env.TECHCOMBANK_ACCOUNT_NAME;
    const bin = process.env.TECHCOMBANK_BIN;

    const params = [];
    if (amount) params.push(`amount=${encodeURIComponent(amount)}`);
    if (description) params.push(`addInfo=${encodeURIComponent(description)}`);
    params.push(`accountName=${encodeURIComponent(accountName)}`);

    const qrUrl = `https://img.vietqr.io/image/${bin}-${accountNo}-print.png?${params.join('&')}`;

    res.json({
      qrUrl,
      accountNo,
      accountName,
      bin,
      amount: amount || 0,
      description: description || ''
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
