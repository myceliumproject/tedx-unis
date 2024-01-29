// @ts-check
import { useState } from "react";
import { Accordion, Badge, Button, Card, Col, Modal, ModalHeader, Row } from "react-bootstrap";
import { MdCheck, MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";

export default function EventBlock({ page = null, seat = null, data, setModalEdit, setCurrentEdit }) {
  const [hover, setHover] = useState(false);

  return (
    <>
      <Card
        border={seat !== null ? "primary" : undefined}
        style={{ position: "relative" }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {page === "staff" && hover && (
          <Button
            variant="primary"
            style={{ position: "absolute", top: "10px", right: "10px" }}
            onClick={() => {
              setCurrentEdit(data)
              setModalEdit(true)
            }}
          >
            <MdEdit /> Editar
          </Button>
        )}
        <Card.Img
          src={data?.img}
          className="object-fit-cover"
          style={{ height: "16rem" }}
        />
        {seat !== null ? (
          <Badge
            color="primary text-nowrap"
            style={{ position: "absolute", top: "1rem", left: "1rem" }}
            pill
          >
            <MdCheck /> Reservado: {seat}
          </Badge>
        ) : null}
        <Card.Body>
          <Card.Subtitle>
            {new Date(data?.datetime).toLocaleDateString()} -{" "}
            {new Date(data?.datetime).toLocaleTimeString()}
          </Card.Subtitle>
        </Card.Body>
        <Accordion
          alwaysOpen
          flush
          className="border-top border-bottom border-tertiary"
        >
          {data?.events.map((ev, i) => (
            <Accordion.Item eventKey={i.toString()} key={i}>
              <Accordion.Header>
                {ev.name} - {ev.speaker}
              </Accordion.Header>
              <Accordion.Body className="p-0">
                <Row>
                  <Col xs={4}>
                    <img src={ev.speakerImg} width="100%" />
                  </Col>
                  <Col xs={8} className="p-2">
                    {ev.description}
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
        {page !== null ? (
          <Card.Body>
            {page === "home" ? (
              <Link to={`/block/${data?.id}`} className="btn btn-primary">
                {seat !== null ? "Ver ticket" : "Conseguir asiento"}
              </Link>
            ) : page === "staff" ? (
              <Link
                to={`/staff/attendance/${data?.id}`}
                className="btn btn-primary"
              >
                Lista de asignados
              </Link>
            ) : null}
          </Card.Body>
        ) : null}
      </Card>
    </>
  );
}
