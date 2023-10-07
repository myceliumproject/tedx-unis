import logo from "$/assets/images/logos/cami-app.png";
import React from "react";
import { Button, Card, Container } from "react-bootstrap";

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container
          className="d-flex justify-content-center align-items-center justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <Card
            className="p-5"
            style={{
              maxWidth: "38rem",
              borderRadius: "2rem",
            }}
          >
            <img src={logo} className="mb-5 mt-5" alt="logo" />
            <h2>Error mostrando página</h2>
            <Button onClick={() => window.location.reload()}>Recargar</Button>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}
