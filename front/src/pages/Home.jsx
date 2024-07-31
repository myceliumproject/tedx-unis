import { urlApi } from "$/environment";
import EventBlock from "$/lib/components/EventBlock";
import { useUser } from "$/lib/hooks/user";
import { timeTo } from "$/lib/utils";
import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Row, Stack } from "react-bootstrap";
import "./Home.css"

export default function Home() {
  const [eventBlocks, setEventBlocks] = useState([]);
  const [mainInfo, setMainInfo] = useState(null);
  const [user] = useUser();

  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    axios.get(urlApi + `/eventblock/list`).then((res) => {
      if (res.data.code === 0) {
        //console.log(res.data)
        setEventBlocks(res.data.data);
      }
    });
  }, []);

  useEffect(() => {
    axios.get(urlApi + `/info`).then((res) => {
      if (res.data.code === 0) {
        setMainInfo(res.data.data);
      }
    });
  }, []);

  useEffect(() => {
    if (mainInfo === null) return;
    if (
      Date.now() >
      new Date(mainInfo.starting_datetime + mainInfo.timezone).getTime()
    )
      return;

    const updateCountdown = () => {
      setCountdown(timeTo(new Date(mainInfo.starting_datetime)));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [mainInfo]);

  return (
    <div>
      <Row>
        <Col xs={12} sm={8}>
          {/* <img src="/integrarse-black.svg" className="w-100" /> */}
          <h1
            className="conectarse"
          >
            Conecta<span style={{ color: "#7B001E" }}>RSE</span>
          </h1>
          <h4>
            Estrategias integrales y sostenibles para la Responsabilidad Social
            Empresarial
          </h4>
        </Col>
        <Col xs={12} sm={4}>
          {mainInfo !== null ? (
            <div className="d-flex align-items-center justify-content-center text-center flex-column h-100">
              {Date.now() <=
              new Date(
                mainInfo.starting_datetime + mainInfo.timezone
              ).getTime() ? (
                <>
                  <div className="fs-3">
                    {new Date(
                      mainInfo.starting_datetime + mainInfo.timezone
                    ).toDateString()}
                  </div>
                  <div className="fs-1 fw-bold">{countdown}</div>
                </>
              ) : (
                <div className="fs-1 fw-bold">¡Ha comenzado!</div>
              )}
            </div>
          ) : null}
        </Col>
      </Row>
      <h1 className="text-center mt-3">Actividades</h1>
      <Stack gap={3}>
        <Row className="gy-4">
          {eventBlocks.map((eb, i) => (
            <Col key={i} md={6} lg={6}>
              <EventBlock
                page="home"
                data={eb}
                seat={
                  user !== null
                    ? user.tickets.find((t) => t.blockId === eb.id)?.seat ??
                      null
                    : null
                }
              />
            </Col>
          ))}
        </Row>
      </Stack>
    </div>
  );
}
