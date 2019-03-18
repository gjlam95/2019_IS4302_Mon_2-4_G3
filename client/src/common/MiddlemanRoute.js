import React from 'react';
import {
    Route
  } from "react-router-dom";
import NotFound from '../common/NotFound';


const MiddlemanRoute = ({ component: Component, authenticated, role, path }) => (
    <Route
      path={path}
      render={props =>
        ((authenticated && role === "middleman") ? (
          <Component path {...props} />
        ) : (
          <NotFound />
        ))
      }
    />
);

export default MiddlemanRoute;
