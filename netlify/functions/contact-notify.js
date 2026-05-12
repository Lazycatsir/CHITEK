exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const payload = JSON.parse(event.body);
    const { name, email, product_type, message } = payload;

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
