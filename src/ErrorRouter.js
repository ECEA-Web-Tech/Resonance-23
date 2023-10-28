import React from "react";
import { useRouteError } from "react-router-dom";
import { Container } from "@mui/material";

function ErrorRouter() {
  const error = useRouteError();
  console.error(error);

  return (
    <Container maxWidth="sm">
      <h1>Oops!</h1>
      <h2>The requested page is not found!!!</h2>
    </Container>
  );
}
export default ErrorRouter;
