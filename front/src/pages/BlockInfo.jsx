// @ts-check
import EventBlock from "$/lib/components/EventBlock";
import Stage from "$/lib/components/Stage";
import { useUser } from "$/lib/hooks/user";
import * as staticData from "$/lib/staticData";
import { useLayoutEffect, useState } from "react";
import { Button, Card, Modal, Stack } from "react-bootstrap";
import QRCode from "react-qr-code";
import { useParams } from "react-router-dom";
import useEvent from "react-use-event-hook";

export default function BlockInfo() {
  const { id: eventBlockId } = useParams();
  const [eventBlock, setEventBlock] = useState(null);

  const [user] = useUser();
  const userTicket = user
    ? user.tickets.find((t) => t.blockId === eventBlock?.id) ?? null
    : null;

  useLayoutEffect(() => {
    // axios.get(urlApi + `/eventblock/get/${eventBlockId}`).then((res) => {
    //   if (res.data.code === 0) {
    //     setEventBlock(res.data.data);
    //   }
    // });
    setEventBlock(staticData.eventBlocks.find((eb) => eb.id === eventBlockId));
  }, [eventBlockId]);

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [seatConfirmationDialog, setSeatConfirmationDialog] = useState(false);
  const confirmSeat = useEvent(() => {
    // axios
    //   .post(urlApi + `/eventblock/reserve/${eventBlockId}`, {
    //     seat: selectedSeat,
    //   })
    //   .then((res) => {
    //     if (res.data.code === 0) {
    //       setEventBlock(res.data.data);
    //     }
    //   });
    setSeatConfirmationDialog(false);
  });

  return (
    <>
      <Stack gap={4}>
        {eventBlock !== null ? <EventBlock data={eventBlock} /> : null}
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
                <Stage readOnly selected={userTicket.seat} />
              </Card.Body>
            </>
          ) : (
            <>
              <Stage selected={selectedSeat} onSelect={setSelectedSeat} />
              <Card.Body>
                <Button
                  onClick={() => setSeatConfirmationDialog(true)}
                  disabled={selectedSeat === null}
                >
                  Confirmar
                </Button>
              </Card.Body>
            </>
          )}
        </Card>
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
