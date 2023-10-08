// @ts-check
import { Accordion, Badge, Card, Col, Row } from "react-bootstrap";
import { MdCheck } from "react-icons/md";
import { Link } from "react-router-dom";

export default function EventBlock({ page = null, seat = null, data }) {
  return (
    <Card border={seat !== null ? "primary" : undefined}>
      <Card.Img
        src={data.img}
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
          {new Date(data.datetime).toLocaleDateString()} -{" "}
          {new Date(data.datetime).toLocaleTimeString()}
        </Card.Subtitle>
      </Card.Body>
      <Accordion
        alwaysOpen
        flush
        className="border-top border-bottom border-tertiary"
      >
        {data.events.map((ev, i) => (
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
            <Link to={`/block/${data.id}`} className="btn btn-primary">
              {seat !== null ? "Ver ticket" : "Conseguir asiento"}
            </Link>
          ) : page === "staff" ? (
            <Link to={`/block/${data.id}/assigned`} className="btn btn-primary">
              Lista de asignados
            </Link>
          ) : null}
        </Card.Body>
      ) : null}
    </Card>
  );
}
