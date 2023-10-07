import { useLayoutEffect } from "react";
import useEvent from "react-use-event-hook";
import io from "socket.io-client";
import { urlApi } from "./environment";

const socket = io(urlApi);

export default function useSocket(events: {
  [s: string]: (...args: any[]) => void;
}) {
  const stringifiedEventKeys = JSON.stringify(Object.keys(events).sort());

  const handleEvent = useEvent((ev: string, ...args) => {
    return events[ev](...args);
  });

  useLayoutEffect(() => {
    const eventKeys = JSON.parse(stringifiedEventKeys);
    const handlers = {};
    for (const ev of eventKeys) {
      handlers[ev] = (...args: any[]) => handleEvent(ev, ...args);
      socket.on(ev, handlers[ev]);
    }
    return () => {
      for (const ev of eventKeys) {
        socket.off(ev, handlers[ev]);
      }
    };
  }, [stringifiedEventKeys, handleEvent]);

  return socket;
}
