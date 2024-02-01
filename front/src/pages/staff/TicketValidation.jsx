import { urlApi } from "$/environment";
import { useUser } from "$/lib/hooks/user";
import { QrScanner } from "@yudiel/react-qr-scanner";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import useEvent from "react-use-event-hook";

export default function TicketValidation() {
  const [user] = useUser();

  const currentSearch = new URL(window.location).searchParams;

  const [scannedData, setScannedData] = useState(
    currentSearch.get("ticket") === null
      ? null
      : {
          name: currentSearch.get("name"),
          block: currentSearch.get("block"),
          seat: currentSearch.get("seat"),
          ticket: currentSearch.get("ticket"),
        }
  );
  const [validatedData, setValidatedData] = useState(null);

  const [canGiveAccess, setCanGiveAccess] = useState(false);

  const confirmTicket = useEvent(() => {
    axios
      .patch(
        urlApi + `/eventblock/confirm?ticket=${scannedData.ticket}`,
        null,
        {
          headers: { "X-Access-Token": user?.token },
        }
      )
      .then((res) => {
        setValidatedData(res.data.data);
      })
      .catch(console.error);
  });

  useEffect(() => {
    if (scannedData === null) return;
    axios
      .patch(
        urlApi + `/eventblock/validate?ticket=${scannedData.ticket}`,
        null,
        {
          headers: { "X-Access-Token": user?.token },
        }
      )
      .then((res) => {
        setValidatedData(res.data.data);
      })
      .catch(console.error);
  }, [scannedData, user?.token]);

  useEffect(() => {
    setCanGiveAccess(false);
    const timeout = setTimeout(() => setCanGiveAccess(true), 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [validatedData]);

  return (
    <div className="d-flex align-items-center justify-content-center align-self-center">
      <div className="border p-4">
        {validatedData === null && scannedData === null ? (
          <div
            style={{
              width: "calc(min(80vh, 80vw))",
              height: "calc(min(80vh, 80vw))",
            }}
          >
            <QrScanner
              onDecode={(result) => {
                /** @type {URL} */
                let url;
                try {
                  url = new URL(result);
                } catch (err) {
                  console.error(err);
                  return;
                }

                const currentSearch = url.searchParams;
                if (currentSearch.get("ticket") === null) return;

                setScannedData({
                  name: currentSearch.get("name"),
                  block: currentSearch.get("block"),
                  seat: currentSearch.get("seat"),
                  ticket: currentSearch.get("ticket"),
                });
              }}
              onError={console.error}
            />
          </div>
        ) : validatedData !== null ? (
          <div>
            <h1>Ticket</h1>
            <ul>
              <li>Titular: {validatedData.name}</li>
              <li>Evento: {validatedData.eventBlock.name}</li>
              <li>Asiento: {validatedData.seat}</li>
            </ul>
            <Row className="g-1">
              <Col xs={12} sm={6}>
                <Button
                  className="w-100 h-100"
                  disabled={!canGiveAccess || validatedData.attended}
                  onClick={() => confirmTicket()}
                >
                  {!canGiveAccess && !validatedData.attended ? (
                    <>
                      <Spinner size="sm" />{" "}
                    </>
                  ) : null}
                  {validatedData.attended
                    ? "Este usuario ya ingresó a la sala"
                    : "Dar acceso"}
                </Button>
              </Col>
              <Col xs={12} sm={6}>
                <Button
                  className="w-100 h-100"
                  variant="outline-primary"
                  onClick={() => {
                    setValidatedData(null);
                    setScannedData(null);
                  }}
                >
                  Escanear otro ticket
                </Button>
              </Col>
            </Row>
          </div>
        ) : scannedData !== null ? (
          <div>
            <h1>Validando ticket...</h1>
            <ul>
              <li>Titular: {scannedData.name}</li>
            </ul>
            <div className="text-center">
              <Spinner />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
