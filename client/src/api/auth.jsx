// contact backend

import axios from "axios";

// shotcut ()=>
export const currentUser = async (token) =>
  await axios.post(
    "http://localhost:1010/api/current-user",
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

// full ()=>{}
export const currentAdmin = async (token) => {
  return await axios.post(
    "http://localhost:1010/api/current-admin",
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
