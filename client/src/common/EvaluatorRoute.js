import React from 'react';
import {
    Route
  } from "react-router-dom";
import NotFound from '../common/NotFound';


const EvaluatorRoute = ({ component: Component, authenticated, role, path }) => (
    <Route
      path={path}
      render={props =>
        ((authenticated && role === "evaluator") ? (
          <Component path {...props} />
        ) : (
          <NotFound />
        ))
      }
    />
);

export default EvaluatorRoute;
