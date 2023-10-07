import Stage from "$/lib/components/Stage";
import useSocket from "$/lib/hooks/socket";
import { useEffect } from "react";
import { Button, Container } from "react-bootstrap";

export default function Home() {
  const socket = useSocket({
    echo: console.log,
  });

  useEffect(() => {
    socket.emit("echo", "hello!");
  }, [socket]);

  return (
    <Container className="text-center">
      <h1>Hello</h1>
      <Stage />
      <Button>Hello</Button>
    </Container>
  );
}
