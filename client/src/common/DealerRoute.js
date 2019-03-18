import React from 'react';
import {
    Route
  } from "react-router-dom";
import NotFound from '../common/NotFound';


const DealerRoute = ({ component: Component, authenticated, role, path }) => (
    <Route
      path={path}
      render={props =>
        ((authenticated && role === "dealer") ? (
          <Component path {...props} />
        ) : (
          <NotFound />
        ))
      }
    />
);

export default DealerRoute;
