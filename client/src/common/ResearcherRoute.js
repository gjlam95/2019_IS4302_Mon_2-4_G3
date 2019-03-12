import React from 'react';
import {
    Route
  } from "react-router-dom";
import NotFound from '../common/NotFound';


const ResearcherRoute = ({ component: Component, authenticated, role, path }) => (
    <Route
      path={path}
      render={props =>
        ((authenticated && role === "researcher") ? (
          <Component path {...props} />
        ) : (
          <NotFound />
        ))
      }
    />
);

export default ResearcherRoute;
