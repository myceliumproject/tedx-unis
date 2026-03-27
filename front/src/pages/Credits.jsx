import Profile from "$/lib/components/Profile";
import { Col, Row } from "react-bootstrap";

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
            song="https://open.spotify.com/embed/track/5Teihsj5GGSvEKCEcJANV7"
          />
        </Col>
        <Col lg={4}>
          <Profile
            image="/luis.webp"
            name="Luis Enrique Menéndez Figueroa"
            linkedin="https://www.linkedin.com/in/luis-enrique-menendez-figueroa-6953a925b/"
            instagram="https://www.instagram.com/wuiquique"
            song="https://open.spotify.com/embed/track/5QOBT97OmYCZo1W5u7tRrB?utm_source=generator"
          />
        </Col>
        <Col lg={4}>
          <Profile
            image="/diego.webp"
            name="Diego David Vallejo Juarez"
            linkedin="https://www.linkedin.com/in/diego-vallejo-ab55a3294/"
            instagram="https://instagram.com/diego_vj_"
            song="https://open.spotify.com/embed/track/4rPl7ezxtoqshKnI1kk3dX?utm_source=generator"
          />
        </Col>
      </Row>
    </>
  );
}
