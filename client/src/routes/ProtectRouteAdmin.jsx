import React, { useEffect, useState } from "react";
import useEcomStore from "../store/ecom-store";
import { currentAdmin } from "../api/auth";
import { LoadingToRedirect } from "../routes/LoadingToRedirect";

// get props element
export const ProtectRouteAdmin = ({ element }) => {
  const [ok, setOk] = useState(false);
  const user = useEcomStore((state) => state.user);
  const token = useEcomStore((state) => state.token);

  useEffect(() => {
    if (user && token) {
      currentAdmin(token)
        .then((res) => setOk(true))
        .catch((err) => setOk(false));
    }
  }, []);
  return ok ? element : <LoadingToRedirect />;
};

export default ProtectRouteAdmin;
