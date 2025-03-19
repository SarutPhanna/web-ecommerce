import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export const LoadingToRedirect = () => {
  const [count, setCount] = useState(3);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // currentCount now = 3
      setCount((currentCount) => {
        // if currentCount = 1 clearInterval and SetRedirect = true
        if (currentCount === 1) {
          clearInterval(interval);
          setRedirect(true);
        }
        return currentCount - 1; // -1 every second
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return <div>No Permission, Redirect in {count}</div>;
};
