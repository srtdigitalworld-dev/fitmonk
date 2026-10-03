import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CustomerEngine, type CustomerOrderRecord } from '../src/backend/services/customer-engine';

test('meaningful customer identification filters out anonymous drafts', () => {
  assert.equal(CustomerEngine.isMeaningfulCustomer(null), false);
  assert.equal(CustomerEngine.isMeaningfulCustomer(''), false);
  assert.equal(CustomerEngine.isMeaningfulCustomer('Pending on WhatsApp'), false);
  assert.equal(CustomerEngine.isMeaningfulCustomer('pending'), false);
  assert.equal(CustomerEngine.isMeaningfulCustomer('+919876543210'), true);
  assert.equal(CustomerEngine.isMeaningfulCustomer('9876543210'), true);
});

test('revenue qualification preserves prepaid-only model and rejects pending drafts and cancelled orders', () => {
  // Paid orders qualify
  assert.equal(CustomerEngine.isQualifyingOrder({ payment_status: 'paid', order_status: 'confirmed' }), true);
  assert.equal(CustomerEngine.isQualifyingOrder({ payment_status: 'paid', order_status: 'delivered' }), true);

  // Unpaid drafts do NOT qualify
  assert.equal(CustomerEngine.isQualifyingOrder({ payment_status: 'pending', order_status: 'pending' }), false);
  assert.equal(CustomerEngine.isQualifyingOrder({ payment_status: 'failed', order_status: 'cancelled' }), false);

  // Cancelled or refunded orders do NOT qualify even if payment was recorded
  assert.equal(CustomerEngine.isQualifyingOrder({ payment_status: 'paid', order_status: 'cancelled' }), false);
  assert.equal(CustomerEngine.isQualifyingOrder({ payment_status: 'paid', order_status: 'refunded' }), false);
});

test('derives customer metrics and ensures pending drafts never inflate revenue', () => {
  const orders: CustomerOrderRecord[] = [
    {
      id: 'ord_1',
      order_number: 'FM-1001',
      customer_name: 'Rahul Sharma',
      customer_phone: '+919876543210',
      customer_email: 'rahul@example.com',
      delivery_address: '123 MG Road',
      apartment: 'Suite 4B',
      city: 'Bengaluru',
      state: 'Karnataka',
      pin_code: '560001',
      grand_total_paise: 99800,
      discount_paise: 0,
      payment_status: 'paid',
      order_status: 'delivered',
      created_at: 1700000000
    },
    {
      id: 'ord_2',
      order_number: 'FM-1002',
      customer_name: 'Rahul Sharma',
      customer_phone: '+919876543210',
      customer_email: 'rahul@example.com',
      delivery_address: '123 MG Road',
      apartment: 'Suite 4B',
      city: 'Bengaluru',
      state: 'Karnataka',
      pin_code: '560001',
      grand_total_paise: 49900,
      discount_paise: 5000,
      coupon_code: 'FITMONK50',
      payment_status: 'paid',
      order_status: 'confirmed',
      created_at: 1700100000
    },
    {
      id: 'ord_3',
      order_number: 'FM-1003',
      customer_name: 'Rahul Sharma',
      customer_phone: '+919876543210',
      delivery_address: '123 MG Road',
      grand_total_paise: 120000, // Unpaid draft inquiry
      payment_status: 'pending',
      order_status: 'pending',
      created_at: 1700200000
    }
  ];

  const customer = CustomerEngine.deriveCustomer('+919876543210', orders);

  assert.equal(customer.name, 'Rahul Sharma');
  assert.equal(customer.phone, '+919876543210');
  assert.equal(customer.email, 'rahul@example.com');
  assert.equal(customer.totalOrders, 3); // 3 total attempts/orders
  assert.equal(customer.qualifyingOrders, 2); // only 2 paid
  assert.equal(customer.totalSpentPaise, 149700); // 99800 + 49900 (120000 draft is EXCLUDED)
  assert.equal(customer.aovPaise, 74850); // 149700 / 2
  assert.equal(customer.isRepeat, true);
  assert.equal(customer.firstOrderAt, 1700000000);
  assert.equal(customer.lastOrderAt, 1700200000);
  assert.equal(customer.latestOrderStatus, 'pending');
  assert.equal(customer.latestAddress.city, 'Bengaluru');
  assert.equal(customer.latestAddress.pinCode, '560001');

  // Coupon history
  assert.equal(customer.couponsUsed.length, 1);
  assert.equal(customer.couponsUsed[0]?.code, 'FITMONK50');
  assert.equal(customer.couponsUsed[0]?.discountPaise, 5000);
  assert.equal(customer.totalCouponDiscountPaise, 5000);
});

test('aggregates orders into customer directory while ignoring anonymous drafts', () => {
  const orders: CustomerOrderRecord[] = [
    {
      id: 'ord_1',
      order_number: 'FM-1001',
      customer_name: 'Rahul Sharma',
      customer_phone: '+919876543210',
      grand_total_paise: 99800,
      payment_status: 'paid',
      order_status: 'delivered',
      created_at: 1700000000
    },
    {
      id: 'ord_2',
      order_number: 'FM-1002',
      customer_name: 'Pooja Verma',
      customer_phone: '9812345678', // 10-digit without +91
      grand_total_paise: 59900,
      payment_status: 'paid',
      order_status: 'confirmed',
      created_at: 1700050000
    },
    {
      id: 'ord_3',
      order_number: 'FM-1003',
      customer_name: 'WhatsApp Buyer',
      customer_phone: 'Pending on WhatsApp', // Draft without customer details
      grand_total_paise: 29900,
      payment_status: 'pending',
      order_status: 'pending',
      created_at: 1700080000
    }
  ];

  const customers = CustomerEngine.aggregateOrders(orders);
  assert.equal(customers.length, 2); // Rahul and Pooja only, anonymous draft skipped

  // Search by name
  const searchedByName = CustomerEngine.filterAndSort(customers, { search: 'pooja' });
  assert.equal(searchedByName.length, 1);
  assert.equal(searchedByName[0]?.name, 'Pooja Verma');

  // Search by phone
  const searchedByPhone = CustomerEngine.filterAndSort(customers, { search: '9876' });
  assert.equal(searchedByPhone.length, 1);
  assert.equal(searchedByPhone[0]?.name, 'Rahul Sharma');

  // Sort by spend
  const sortedBySpend = CustomerEngine.filterAndSort(customers, { sort: 'total_spent_desc' });
  assert.equal(sortedBySpend[0]?.name, 'Rahul Sharma');
});
