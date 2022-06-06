const axios = require('axios').default
require('dotenv').config();

const { PP_CLIENT_ID, PP_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

const createOrder = async () => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const response = await axios.post(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "EUR",
            value: "3.99",
          },
        },
      ],
    }),
  });
  const data = await response.json();
  console.log(data);
  return data;
}

const capturePayment = async (orderId) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderId}/capture`;
  const response = await axios.post(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  console.log(data);
  return data;
}

const generateAccessToken = async () => {
  const response = await axios.post(base + "/v1/oauth2/token", {
    body: "grant_type=client_credentials",
    headers: {
      Authorization:
        "Basic " + Buffer.from(PP_CLIENT_ID + ":" + PP_SECRET).toString("base64"),
    },
  });
  const data = await response.json();
  return data.access_token;
}