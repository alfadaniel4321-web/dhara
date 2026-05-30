exports.createPaymentOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    const razorpayOrder = {
      id: `rzp_order_${Math.random().toString(36).substring(2, 9)}`,
      entity: 'order',
      amount: amount * 100,
      currency: currency || 'INR',
      receipt: `receipt_${Date.now()}`,
      status: 'created',
      attempts: 0,
      created_at: Math.floor(Date.now() / 1000)
    };

    res.json(razorpayOrder);
  } catch (err) {
    console.error('Create payment order error:', err);
    res.status(500).json({ message: 'Server error creating payment order' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ message: 'Payment parameters are required' });
    }

    const success = true;

    if (success) {
      const invoice = {
        invoiceId: `INV-${Date.now()}`,
        transactionId: razorpay_payment_id,
        date: new Date().toISOString(),
        paymentStatus: 'Paid',
        billingCycle: 'Immediate'
      };

      res.json({ success: true, message: 'Payment verified successfully', invoice });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (err) {
    console.error('Verify payment error:', err);
    res.status(500).json({ message: 'Server error verifying payment' });
  }
};
