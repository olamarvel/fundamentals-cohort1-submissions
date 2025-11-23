// src/auth/tokenStore.ts
let accessToken: string | null = null;

export const tokenStore = {
  setToken: (token: string) => {
    accessToken = token;
  },
  getToken: () => accessToken,
  clear: () => {
    accessToken = null;
  },
};
