import { Button, Card } from "react-bootstrap";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Card className="m-4">
      <Card.Header className="fw-bold">Página desconocida</Card.Header>
      <Card.Body>La página a la que ingresó no ha sido encontrada</Card.Body>
      <Card.Footer>
        <Button onClick={() => navigate(-1)}>
          <MdArrowBack /> Regresar
        </Button>
      </Card.Footer>
    </Card>
  );
}
