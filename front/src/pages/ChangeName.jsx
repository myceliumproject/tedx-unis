import { urlApi } from "$/environment";
import { useUser } from "$/lib/hooks/user";
import { wrapSubmit } from "$/lib/utils";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import useEvent from "react-use-event-hook";

export default function ChangeName() {
  const [user, setUser] = useUser();
  const [name, setName] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const changeName = useEvent(async () => {
    const res = await axios.post(urlApi + `/user/changename`, { name });
    if (res.data.code === 0) {
      setUser({ ...user, name });
      navigate(searchParams.get("return") ?? "/");
    }
  });

  useEffect(() => {
    if (user === null) return;
    setName(user.name);
  }, [user]);

  return (
    <div className="p-3 text-center d-flex align-items-center justify-content-center align-self-center">
      <div className="border p-4 align-items-center">
        <h1 className="text-center">Cambiar nombre</h1>
        <Form onSubmit={wrapSubmit(changeName)}>
          <p>¿Cuál es tu nombre?</p>
          <FloatingLabel controlId="code" label="Nombre" className="mb-3">
            <Form.Control
              required
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
          </FloatingLabel>
          <Button
            type="submit"
            className="align-self-center rounded text-white"
          >
            Ingresar
          </Button>
        </Form>
      </div>
    </div>
  );
}
