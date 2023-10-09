import Profile from "$/lib/components/Profile";
import { Button, Card, Col, Row } from "react-bootstrap";
import { AiOutlineInstagram, AiOutlineLinkedin } from "react-icons/ai";

export default function Creditos() {
  return (
    <>
      <Row>
        <Col lg={4}>
          <Profile
            image="/juan.jpg"
            name="Juan Rafael Berganza Campos"
            linkedin="https://www.linkedin.com/in/juan-berganza-17b23b288/"
            instagram="https://www.instagram.com/jrberganza/"
            song="https://open.spotify.com/embed/track/5KE5Inz4uZKGb2EzETaOEe"
          />
        </Col>
        <Col lg={4}>
          <Profile
            image="/luis.webp"
            name="Luis Enrique Menéndez Figueroa"
            linkedin="https://www.linkedin.com/in/luis-enrique-menendez-figueroa-6953a925b/"
            instagram="https://www.instagram.com/wuiquique"
            song="https://open.spotify.com/embed/track/5w9upngVRHNjdZcRC7Xxr2?utm_source=generator"
          />
        </Col>
        <Col lg={4}>
          <Profile
            image="/diego.webp"
            name="Diego David Vallejo Juarez"
            linkedin="https://www.linkedin.com/in/diego-vallejo-ab55a3294/"
            instagram="https://instagram.com/diego_vj_"
            song="https://open.spotify.com/embed/track/1DTRrxBn0L0Mqe5j26ZA6h?utm_source=generator"
          />
        </Col>
      </Row>
      <h3 className="text-center">Agradecimientos</h3>
      <Row>
        <Col></Col>
        <Col md={6}>
          <Card className="profile-card">
            <Row>
              <Col xs={5} lg={3}>
                <Card.Img
                  variant="top"
                  src="/juanpa.webp"
                  className="rounded-circle"
                  style={{ width: "150px", height: "150px" }}
                />
              </Col>
              <Col xs={7} lg={9}>
                <Card.Body>
                  <Card.Title>Juan Pablo Vallejo Juarez</Card.Title>
                  <Button
                    variant="warning"
                    href={"https://www.linkedin.com/in/juanpavallejo"}
                    className="mx-2"
                  >
                    <AiOutlineLinkedin />
                  </Button>
                  <Button
                    variant="light"
                    href={"https://instagram.com/juanpa_vallejo"}
                  >
                    <AiOutlineInstagram />
                  </Button>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col></Col>
      </Row>
    </>
  );
}
