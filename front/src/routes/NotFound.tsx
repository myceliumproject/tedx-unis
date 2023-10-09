import { Button, Card, Container } from "react-bootstrap";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container className="d-flex justify-content-center align-items-center justify-content-center">
      <Card className="p-5">
        <img src="/tedxblack.svg" className="mb-5 mt-5" alt="" />
        <h2>Página desconocida</h2>
        <Button onClick={() => navigate(-1)}>
          <MdArrowBack /> Regresar
        </Button>
      </Card>
    </Container>
  );
}
