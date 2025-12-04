import api from "./client";

export async function login(username: string) {
  const { data } = await api.post("/auth/login", { username });
  localStorage.setItem("accessToken", data.token);
  return data;
}

export async function logout() {
  await api.post("/auth/logout");
  localStorage.removeItem("accessToken");
}
