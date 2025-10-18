export const getOrderEmailTemplate = (order) => {
  const productList = order.products.map(
    (p) => `
      <tr>
        <td style="padding:8px;border:1px solid #ddd;">${p.name}</td>
        <td style="padding:8px;border:1px solid #ddd;">${p.quantity}</td>
        <td style="padding:8px;border:1px solid #ddd;">₹${p.price}</td>
        <td style="padding:8px;border:1px solid #ddd;">
          ${p.offer?.isActive ? `${p.offer.type} (${p.offer.value})` : "—"}
        </td>
      </tr>
    `
  ).join("");

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#333;">
      <h2 style="color:#2c3e50;">🛒 New Order Received</h2>
      <p><b>Customer:</b> ${order.customer} (${order.email})</p>
      <p><b>Shipping Address:</b> ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.zipCode}</p>
      <p><b>Payment Method:</b> ${order.paymentMethod}</p>
      <p><b>Status:</b> ${order.status}</p>

      <h3>Products:</h3>
      <table style="border-collapse:collapse;width:100%;margin:10px 0;">
        <thead>
          <tr style="background:#f4f4f4;">
            <th style="padding:8px;border:1px solid #ddd;">Product</th>
            <th style="padding:8px;border:1px solid #ddd;">Qty</th>
            <th style="padding:8px;border:1px solid #ddd;">Price</th>
            <th style="padding:8px;border:1px solid #ddd;">Offer</th>
          </tr>
        </thead>
        <tbody>
          ${productList}
        </tbody>
      </table>

      <h3>Summary:</h3>
      <p><b>Subtotal:</b> ₹${order.itemsTotal}</p>
      <p><b>Delivery Fee:</b> ₹${order.deliveryFee}</p>
      <p><b>Tax:</b> ₹${order.taxAmount}</p>
      <p><b>Discount:</b> -₹${order.couponDiscount}</p>
      <h2 style="color:#27ae60;">Final Total: ₹${order.finalTotal}</h2>
    </div>
  `;
};
