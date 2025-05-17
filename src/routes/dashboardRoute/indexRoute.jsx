import React from "react";
import adminRoute from "./adminRoute";
import schoolRoute from "./schoolRoute";
import parentRoute from "./parentRoute";

const indexRoute = () => {
  return (
    <>
      {adminRoute()}
      {schoolRoute()}
      {parentRoute()}
    </>
  );
};

export default indexRoute;
