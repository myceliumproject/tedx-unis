import EventBlock from "$/lib/components/EventBlock";
import { useUser } from "$/lib/hooks/user";
import * as staticData from "$/lib/staticData";
import { useLayoutEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import axios from "axios";
import { urlApi } from "$/environment";

export default function Home() {
  const [eventBlocks, setEventBlocks] = useState([]);
  const [user] = useUser();

  useLayoutEffect(() => {
    axios.get(urlApi + `/eventblock/list`).then((res) => {
      if (res.data.code === 0) {
        //console.log(res.data)
        setEventBlocks(res.data.data)
      }
    });
    setEventBlocks(staticData.eventBlocks);
  }, []);

  return (
    <div>
      <h1 className="text-center">Bloques</h1>
      <Stack gap={3}>
        {eventBlocks.map((eb, i) => (
          <EventBlock
            key={i}
            page="home"
            data={eb}
            seat={
              user !== null
                ? user.tickets.find((t) => t.blockId === eb.id)?.seat ?? null
                : null
            }
          />
        ))}
      </Stack>
    </div>
  );
}
