exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const payload = JSON.parse(event.body);

    // Product Type 是多选 checkbox：表单可能提交字符串或数组，统一成逗号分隔串
    let product_type = payload.product_type;
    if (Array.isArray(product_type)) product_type = product_type.join(', ');
    product_type = product_type || 'unknown';

    const { name, email, message } = payload;

    // Log submission for debugging
    console.log("Contact form submission:", {
      name,
      email,
      product_type,
      message: message?.substring(0, 100) + "...",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("Contact form error:", err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid payload" }),
    };
  }
};
