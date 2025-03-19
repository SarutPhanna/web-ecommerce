import React, { useEffect, useState } from "react";
import useEcomStore from "../store/ecom-store";
import { currentUser } from "../api/auth";
import { LoadingToRedirect } from "../routes/LoadingToRedirect";

// get props element
export const ProtectRouteUser = ({ element }) => {
  const [ok, setOk] = useState(false);
  const user = useEcomStore((state) => state.user);
  const token = useEcomStore((state) => state.token);

  useEffect(() => {
    if (user && token) {
      currentUser(token)
        .then((res) => setOk(true))
        .catch((err) => setOk(false));
    }
  }, []);
  return ok ? element : <LoadingToRedirect />;
};

export default ProtectRouteUser;
