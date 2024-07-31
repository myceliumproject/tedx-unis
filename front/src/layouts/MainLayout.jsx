import IntegraRSELogo from "$/lib/components/IntegraRSELogo";
import { useUser } from "$/lib/hooks/user";
import ErrorBoundary from "$/routes/ErrorBoundary";
import { Badge, Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

export default function MainLayout() {
  const [user] = useUser();

  return (
    <ErrorBoundary>
      <Stack style={{ minHeight: "100vh" }}>
        <Navbar expand="lg" bg="primary" variant="dark">
          <Container>
            <Navbar.Brand as={Link} to="/">
              <IntegraRSELogo />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">
                  Actividades
                </Nav.Link>
                {user !== null ? (
                  <Nav.Link as={Link} to="/changename">
                    Cambiar nombre
                  </Nav.Link>
                ) : null}
                {user === null ? (
                  <Nav.Link as={Link} to="/auth">
                    Inicio de sesión
                  </Nav.Link>
                ) : user.userType === "staff" || user.userType === "admin" ? (
                  <Nav.Link as={Link} to="/staff">
                    Staff
                  </Nav.Link>
                ) : null}
                {user !== null ? (
                  <Nav.Link
                    onClick={() => {
                      localStorage.clear();
                      setTimeout(() => (window.location.href = "/"), 100);
                    }}
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
              paddingTop: "20px",
              borderRadius: "40px",
              marginInline: "20px",
            }}
          >
            <img
              src="/sponsors/Logo UNIS3 (2).png"
              style={{ height: "60px", objectFit: "contain" }}
            />
            &nbsp;
            <img
              src="/sponsors/industrias san miguel.jpeg"
              style={{ height: "100px", objectFit: "contain" }}
            />
            &nbsp;
            <img
              src="/sponsors/GIZ1.jpeg"
              style={{ height: "110px", objectFit: "contain" }}
            />
            &nbsp;
            <img
              src="/sponsors/GIZ2.jpeg"
              style={{ height: "110px", objectFit: "contain" }}
            />
            &nbsp;
            <img
              src="/sponsors/GIZ3.jpeg"
              style={{ height: "110px", objectFit: "contain" }}
            />
            &nbsp;
            <img
              src="/sponsors/GIZ4.jpeg"
              style={{ height: "110px", objectFit: "contain" }}
            />
          </div>
          <h5 style={{ color: "#bababa", marginTop: "20px" }}>
            Con el apoyo de
          </h5>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              paddingInline: "40px",
              paddingTop: "20px",
              paddingBottom: "20px",
              borderRadius: "40px",
              marginInline: "20px",
            }}
          >
            <img
              src="/sponsors/alianza por los jóvenes.jpeg"
              style={{ height: "70px", objectFit: "contain" }}
            />
            &nbsp;
            <img
              src="/sponsors/AMBEV.png"
              style={{ height: "90px", objectFit: "contain" }}
            />
            &nbsp;
            <img
              src="/sponsors/BI.png"
              style={{ height: "70px", objectFit: "contain" }}
            />
            &nbsp;
            <img
              src="https://cdn.prod.website-files.com/615f5753a32dcc1e9220daf6/617c02076c73e8e183778da7_LOGO%20DE%20CIUDAD%20CAYALA-01.png"
              style={{ height: "80px", objectFit: "contain" }}
            />
            &nbsp;
            <img
              src="/sponsors/biorem.png"
              style={{ height: "120px", objectFit: "contain" }}
            />
            &nbsp;
            <img
              src="https://cig.industriaguate.com/wp-content/uploads/2024/01/Dinamic.png"
              style={{ height: "80px", objectFit: "contain" }}
            />
            &nbsp;
            <img
              src="https://media.licdn.com/dms/image/D4E0BAQEThtXGj1QKjQ/company-logo_200_200/0/1696609506901/zigiapp_logo?e=2147483647&v=beta&t=yrOoxYy8Y3HSUhK0H_7qSXwCtal4i8WY5r6vkjOCBCg"
              style={{
                height: "70px",
                objectFit: "contain",
                paddingLeft: "20px",
              }}
            />
            &nbsp;
            <img
              src="https://cig.industriaguate.com/wp-content/uploads/2024/04/CIG_Joven-1024x427.jpg"
              style={{
                height: "80px",
                objectFit: "contain",
                paddingTop: "5px",
              }}
            />
            &nbsp;
            <img
              src="https://guatemala.ureport.in/sitestatic/img/logos/UREPORT/U-Report_Logo_EN.png"
              style={{ height: "70px", objectFit: "contain" }}
            />
            &nbsp;
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Bac_credomatic_logo.png"
              style={{
                height: "60px",
                objectFit: "contain",
                paddingTop: "10px",
              }}
            />
            &nbsp;
            <img
              src="https://flavorite.io/wp-content/themes/flavorite/img/logo.png"
              style={{
                height: "60px",
                objectFit: "contain",
                paddingLeft: "20px",
                paddingTop: "10px",
              }}
            />
            &nbsp;
            <img
              src="https://cig.industriaguate.com/wp-content/uploads/2021/09/logo-cig.png"
              style={{
                height: "60px",
                objectFit: "contain",
                paddingLeft: "10px",
                paddingTop: "10px",
              }}
            />
            &nbsp;
            <img
              src="https://grupovical.com/wp-content/uploads/2018/11/vical-logo-03.png"
              style={{
                height: "40px",
                objectFit: "contain",
                paddingLeft: "10px",
                paddingTop: "10px",
              }}
            />
          </div>
        </div>
      </Stack>
    </ErrorBoundary>
  );
}
