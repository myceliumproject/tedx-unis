import { urlApi } from "$/environment";
import EventBlock from "$/lib/components/EventBlock";
import { useUser } from "$/lib/hooks/user";
import axios from "axios";
import { useLayoutEffect, useState } from "react";
import { Col, Row, Stack } from "react-bootstrap";

export default function Home() {
  const [eventBlocks, setEventBlocks] = useState([]);
  const [user] = useUser();

  useLayoutEffect(() => {
    axios.get(urlApi + `/eventblock/list`).then((res) => {
      if (res.data.code === 0) {
        //console.log(res.data)
        setEventBlocks(res.data.data);
      }
    });
  }, []);

  return (
    <div>
      <h1 className="text-center">Bloques</h1>
      <Stack gap={3}>
        <Row className="gy-4">
          {eventBlocks.map((eb, i) => (
            <Col key={i} md={6} lg={4}>
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
