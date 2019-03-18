import React from 'react';
import {
    Route
  } from "react-router-dom";
import NotFound from '../common/NotFound';


const SellerRoute = ({ component: Component, authenticated, role, path }) => (
    <Route
      path={path}
      render={props =>
        ((authenticated && role === "seller") ? (
          <Component path {...props} />
        ) : (
          <NotFound />
        ))
      }
    />
);

export default SellerRoute;
