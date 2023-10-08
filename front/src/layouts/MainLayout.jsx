import { useUser } from "$/lib/hooks/user";
import ErrorBoundary from "$/routes/ErrorBoundary";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

export default function MainLayout() {
  const [user] = useUser();

  return (
    <ErrorBoundary>
      <Navbar expand="lg" bg="primary" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">
            TEDxUNIS
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">
                Bloques
              </Nav.Link>
              {user === null ? (
                <Nav.Link as={Link} to="/auth">
                  Inicio de sesión
                </Nav.Link>
              ) : null}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="py-4">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </Container>
    </ErrorBoundary>
  );
}
