const Order = require('../models/Order');

describe('Find Payment Methods', () => {
    it('should show payment method enum values', () => {
        const paymentMethodPath = Order.schema.path('paymentMethod');
        console.log('Payment method enum values:', paymentMethodPath.enumValues);
        expect(true).toBe(true);
    });
});