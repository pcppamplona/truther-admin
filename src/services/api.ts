import ky from "ky";

export const api = ky.create({
  prefixUrl: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});
