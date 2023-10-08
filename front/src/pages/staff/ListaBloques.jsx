import EventBlock from "$/lib/components/EventBlock";
import * as staticData from "$/lib/staticData";
import { useLayoutEffect, useState } from "react";
import { Stack } from "react-bootstrap";

export default function ListaBloques() {
  const [eventBlocks, setEventBlocks] = useState([]);

  useLayoutEffect(() => {
    // axios.get(urlApi + `/eventblock/list`).then((res) => {
    //   if (res.data.code === 0) {
    //     setEventBlocks(res.data.data);
    //   }
    // });
    setEventBlocks(staticData.eventBlocks);
  }, []);
  return (
    <div>
      <h1 className="text-center">Bloques</h1>
      <Stack gap={3}>
        {eventBlocks.map((eb, i) => (
          <EventBlock key={i} page="staff" data={eb} />
        ))}
      </Stack>
    </div>
  );
}
