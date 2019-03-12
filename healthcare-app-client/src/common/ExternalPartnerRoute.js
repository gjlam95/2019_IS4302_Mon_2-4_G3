import React from 'react';
import {
    Route
  } from "react-router-dom";
import NotFound from '../common/NotFound';


const ExternalPartnerRoute = ({ component: Component, authenticated, role, path }) => (
    <Route
      path={path}
      render={props =>
        ((authenticated && role === "external partner") ? (
          <Component path {...props} />
        ) : (
          <NotFound />
        ))
      }
    />
);

export default ExternalPartnerRoute;
