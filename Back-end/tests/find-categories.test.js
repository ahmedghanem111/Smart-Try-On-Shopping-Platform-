const Product = require('../models/Product');

describe('Find Product Categories', () => {
    it('should show category enum values', () => {
        const categoryPath = Product.schema.path('category');
        console.log('Category enum values:', categoryPath.enumValues);
        expect(true).toBe(true);
    });
});