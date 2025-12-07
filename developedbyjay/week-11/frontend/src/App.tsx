// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import Login from "./pages/login";
import Transactions from "./pages/transaction";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
