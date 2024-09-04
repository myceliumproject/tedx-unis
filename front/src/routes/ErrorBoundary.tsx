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
        <Container className="d-flex justify-content-center align-items-center justify-content-center">
          <Card className="p-5">
            <img src="/minds-white.svg" className="mb-4 mt-2 w-100" alt="" />
            <h2>Error mostrando página</h2>
            <Button onClick={() => window.location.reload()}>Recargar</Button>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}
