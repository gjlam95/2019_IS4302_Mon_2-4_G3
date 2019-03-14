import React from 'react';
import {
    Route
  } from "react-router-dom";
import NotFound from '../common/NotFound';


const BuyerRoute = ({ component: Component, authenticated, role, path }) => (
    <Route
      path={path}
      render={props =>
        ((authenticated && role === "buyer") ? (
          <Component path {...props} />
        ) : (
          <NotFound />
        ))
      }
    />
);

export default BuyerRoute;
