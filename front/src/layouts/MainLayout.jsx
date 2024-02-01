import Logo from "$/lib/components/Logo";
import TEDxLogo from "$/lib/components/TEDxLogo";
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
            <TEDxLogo />
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
              ) : user.userType === "staff" || user.userType === "admin" ? (
                <Nav.Link as={Link} to="/staff">
                  Staff
                </Nav.Link>
              ) : null}
            </Nav>
            <Navbar.Text>
              Powered by:{" "}
              <Link to="/by">
                <Logo /> Mycelium
              </Link>
            </Navbar.Text>
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
