export const getSearchParams = (value) => {
  if (!value) return { name: "", email: "", order_number: "" };

  // Email: contains @
  if (value.includes("@")) {
    return { name: "", email: value, order_number: "" };
  }

  // Order number: all digits (adjust regex to match your order number format)
  if (/^\d{4}-\d{4}$/.test(value)) {
    return { name: "", email: "", order_number: value };
  }

  // Default: treat as name
  return { name: value, email: "", order_number: "" };
};
