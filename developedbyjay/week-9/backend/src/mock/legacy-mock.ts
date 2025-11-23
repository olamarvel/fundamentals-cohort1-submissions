import express from "express";

export function startMockLegacy(port = 4001) {
  const app = express();
  app.use(express.json());

  app.get("/legacy/payments", (req, res) => {
  
    res.json([
      {
        id: "p_100",
        amt: 12345,
        currency: "NGN",
        status_code: 1,
        payer: { name: "Tunde", account_id: "a_1" },
        created_at: "2024-11-01T12:00:00Z",
      },
      {
        id: "p_101",
        amt: 60000,
        currency: "NGN",
        status_code: 1,
        payer: { name: "Joshua", account_id: "a_3" },
        created_at: "2024-11-01T12:00:00Z",
      },
      {
        id: "p_104",
        amt: 50000,
        currency: "NGN",
        status_code: 2,
        payer: { name: "Chi", account_id: "a_2" },
        created_at: "2024-11-02T09:00:00Z",
      },
      {
        id: "p_105",
        amt: 3400,
        currency: "NGN",
        status_code: 2,
        payer: { name: "Caleb", account_id: "a_3" },
        created_at: "2024-01-02T09:00:00Z",
      },
    ]);
  });

 
  app.get("/legacy/customers", (_, res) => {
    res.json([
      {
        cust_id: "c_1",
        fullname: "Tunde A",
        email: "tunde@example.com",
        meta: { signup: "2015" },
      },
      {
        cust_id: "c_2",
        fullname: "Chi B",
        email: "chi@example.com",
        meta: { signup: "2018" },
      },
    ]);
  });

  app.listen(port, () =>
    console.log(`Mock legacy API running at http://localhost:${port}`)
  );
}
