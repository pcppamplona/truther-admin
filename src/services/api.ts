import ky from "ky";

export const api = ky.create({
  // prefixUrl: "http://localhost:3001",
  prefixUrl: "https://pamplona-back.yexuz7.easypanel.host",  
  headers: {
    "Content-Type": "application/json",
  },
});
