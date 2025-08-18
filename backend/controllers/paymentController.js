import { validatePayment } from '../web3/paymentUtils.js';

export const verifyPayment = async (req, res) => {
  const { txHash } = req.body;

  try {
    await validatePayment(txHash, 0.001); // expecting 0.001 ETH
    res.json({ success: true, message: 'Payment verified' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
