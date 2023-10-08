// @ts-check
import { urlApi } from "$/environment";
import EventBlock from "$/lib/components/EventBlock";
import Stage from "$/lib/components/Stage";
import { useUser } from "$/lib/hooks/user";
import axios from "axios";
import { useLayoutEffect, useState } from "react";
import { Button, Card, Modal, Stack } from "react-bootstrap";
import QRCode from "react-qr-code";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useEvent from "react-use-event-hook";

export default function BlockInfo() {
  const { id: eventBlockId } = useParams();
  const [searchParams] = useSearchParams();
  const [eventBlock, setEventBlock] = useState(null);

  const navigate = useNavigate();

  const [user] = useUser();
  const userTicket = user
    ? user.tickets.find((t) => t.blockId === eventBlock?.id) ?? null
    : null;

  useLayoutEffect(() => {
    axios.get(urlApi + `/eventblock/get/${eventBlockId}`).then((res) => {
      if (res.data.code === 0) {
        //console.log(res.data)
        setEventBlock(res.data.data);
      }
    });
  }, [eventBlockId]);

  const [selectedSeat, setSelectedSeat] = useState(searchParams.get("seat"));
  const [seatConfirmationDialog, setSeatConfirmationDialog] = useState(false);
  const confirmSeat = useEvent(() => {
    let post = {
      seat: selectedSeat,
      userId: user.id,
      name: user.name,
    };
    axios
      .patch(urlApi + `/eventblock/reserve/${eventBlockId}`, post)
      .then((res) => {
        if (res.data.code === 0) {
          setEventBlock(res.data.data);
        }
      });
    setSeatConfirmationDialog(false);
  });

  return (
    <>
      <Stack gap={4}>
        {eventBlock !== null ? (
          <>
            <EventBlock data={eventBlock} />
            <Card>
              {userTicket !== null ? (
                <>
                  <Card.Header>Ticket</Card.Header>
                  <Card.Body className="text-center">
                    <div>
                      <QRCode value={userTicket.token} />
                    </div>
                    <Card.Text className="mt-2">
                      Has reservado el asiento {userTicket.seat}
                    </Card.Text>
                    <Stage
                      readOnly
                      selected={userTicket.seat}
                      taken={eventBlock.takenSeats}
                    />
                  </Card.Body>
                </>
              ) : (
                <>
                  <Stage
                    progressiveUnblock
                    selected={selectedSeat}
                    onSelect={setSelectedSeat}
                    taken={eventBlock.takenSeats}
                  />
                  <Card.Body>
                    <Button
                      onClick={() =>
                        user === null
                          ? navigate(
                              `/auth?return=${encodeURIComponent(
                                window.location.pathname +
                                  "?seat=" +
                                  selectedSeat
                              )}`
                            )
                          : setSeatConfirmationDialog(true)
                      }
                      disabled={selectedSeat === null}
                    >
                      Confirmar
                    </Button>
                  </Card.Body>
                </>
              )}
            </Card>
          </>
        ) : null}
      </Stack>
      <Modal
        show={seatConfirmationDialog}
        onHide={() => setSeatConfirmationDialog(false)}
      >
        <Modal.Body>Se reservará el asiento {selectedSeat}</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => confirmSeat()}>Confirmar</Button>
          <Button
            variant="outline-primary"
            onClick={() => setSeatConfirmationDialog(false)}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
