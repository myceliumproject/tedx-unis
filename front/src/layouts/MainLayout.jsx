import { useUser } from "$/lib/hooks/user";
import ErrorBoundary from "$/routes/ErrorBoundary";
import { Badge, Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

export default function MainLayout() {
  const [user] = useUser();

  return (
    <ErrorBoundary>
      <Stack
        style={{ minHeight: "100vh", backgroundColor: "#111314" }}
        // className="bg-dark"
      >
        <Navbar expand="lg" variant="dark">
          <Container>
            <Navbar.Brand as={Link} to="/">
              MINDS VOL 2 LOGO
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/" className="navText">
                  Actividades
                </Nav.Link>
                {user !== null ? (
                  <Nav.Link as={Link} to="/changename" className="navText">
                    Cambiar nombre
                  </Nav.Link>
                ) : null}
                {user === null ? (
                  <Nav.Link as={Link} to="/auth" className="navText">
                    Inicio de sesión
                  </Nav.Link>
                ) : user.userType === "staff" || user.userType === "admin" ? (
                  <Nav.Link as={Link} to="/staff" className="navText">
                    Staff
                  </Nav.Link>
                ) : null}
                {user !== null ? (
                  <Nav.Link
                    onClick={() => {
                      localStorage.clear();
                      setTimeout(() => (window.location.href = "/"), 100);
                    }}
                    className="navText"
                  >
                    Cerrar sesión
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
        <div
          className="bg-dark  text-white pt-3 d-flex flex-column align-items-center gap-3 flex-grow-1"
          style={{ paddingBottom: "60px" }}
        >
          <div
            style={{
              display: "flex",
              marginTop: "20px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <img
              src="/mycelium.svg"
              style={{
                height: "150px",
                objectFit: "conatain",
                marginBottom: "20px",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "40px",
                justifyContent: "center",
              }}
            >
              <h2 style={{ color: "#bababa" }}>
                Powered by:{" "}
                <Link className="text-white" to="/by">
                  Mycelium
                </Link>
              </h2>
              <h4>
                <Badge pill>
                  <span>Facultad de Ingenieria (FING), ISCC. 2024</span>
                </Badge>
              </h4>
            </div>
          </div>
          <h5 style={{ color: "#bababa" }}>Con el patrocinio de</h5>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
              paddingInline: "40px",
              borderRadius: "40px",
              marginInline: "20px",
            }}
          >
            <img
              src="/sponsors/fie.png"
              style={{ height: "90px", objectFit: "contain" }}
            />
            &nbsp;
            <img
              src="/sponsors/gyt.png"
              style={{ height: "110px", objectFit: "contain" }}
            />
            &nbsp;
            <img
              src="/sponsors/osmo.png"
              style={{ height: "50px", objectFit: "contain" }}
            />
            &nbsp;
            <img
              src="/sponsors/Redbull NEGRO.png"
              style={{
                height: "80px",
                objectFit: "contain",
                marginLeft: "30px",
              }}
            />
            &nbsp;
            <img
              src="/sponsors/ZIGI.png"
              style={{ height: "90px", objectFit: "contain" }}
            />
          </div>
        </div>
      </Stack>
    </ErrorBoundary>
  );
}
