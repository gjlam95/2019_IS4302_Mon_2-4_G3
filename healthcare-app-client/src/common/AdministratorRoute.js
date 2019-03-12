import React from 'react';
import {
    Route
  } from "react-router-dom";
import NotFound from '../common/NotFound';


const AdministratorRoute = ({ component: Component, authenticated, role, path }) => (
    <Route
      path={path}
      render={props =>
        ((authenticated && role === "administrator") ? (
          <Component path {...props} />
        ) : (
          <NotFound />
        ))
      }
    />
);

export default AdministratorRoute;
