import type { NextApiRequest, NextApiResponse } from "next";

// MODÜL 4 · BFF (Backend for Frontend) API Route Örneği
// Gerçek bir kurumsal senaryoda burada Promise.all ile birden fazla
// mikroservise (Order/Payment/User API) PARALEL istek atılır, secret'lar
// sadece server-side (env variable) tutulur ve response frontend'in TAM
// ihtiyacı olan şekle indirgenir (response shaping).
//
// Bu iskelette servisler mock'lanmıştır — kendi API_URL'lerinizi
// .env.local dosyasında tanımlayıp fetch çağrılarını buraya bağlayın.

type DashboardResponse = {
  orders: number;
  payments: number;
  users: number;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardResponse | { error: string }>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // const [orders, payments, users] = await Promise.all([
  //   fetch(process.env.ORDER_API_URL!, { headers: { Authorization: `Bearer ${process.env.SERVICE_TOKEN}` } }),
  //   fetch(process.env.PAYMENT_API_URL!, { headers: { Authorization: `Bearer ${process.env.SERVICE_TOKEN}` } }),
  //   fetch(process.env.USER_API_URL!, { headers: { Authorization: `Bearer ${process.env.SERVICE_TOKEN}` } }),
  // ]);

  const mockData: DashboardResponse = {
    orders: 128,
    payments: 96,
    users: 42,
  };

  return res.status(200).json(mockData);
}
