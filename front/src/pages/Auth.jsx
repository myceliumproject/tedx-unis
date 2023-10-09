import { urlApi } from "$/environment";
import { useUser } from "$/lib/hooks/user";
import { wrapSubmit } from "$/lib/utils";
import axios from "axios";
import { useLayoutEffect, useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import useEvent from "react-use-event-hook";

export default function Auth() {
  const [user, setUser] = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const [authRequested, setAuthRequested] = useState(false);

  const [code, setCode] = useState("");

  const sendAuthRequest = useEvent(async () => {
    const res = await axios.post(urlApi + `/user/authrequest`, { email, name });
    if (res.data.code === 0) {
      setAuthRequested(true);
    }
  });

  const finalizeAuth = useEvent(async () => {
    const res = await axios.post(urlApi + `/user/auth`, { email, code });
    if (res.data.code === 0) {
      setUser(res.data.data);
    }
  });

  useLayoutEffect(() => {
    if (user !== null) navigate(searchParams.get("return") ?? "/");
  }, [navigate, searchParams, user]);

  return (
    <div className="p-3 text-center d-flex align-items-center justify-content-center align-self-center">
      <div className="border p-4 align-items-center">
        <h1 className="text-center">Iniciar Sesión</h1>
        {!authRequested ? (
          <form onSubmit={wrapSubmit(sendAuthRequest)}>
            <div className="form-floating mb-3">
              <input
                type="email"
                id="email"
                className="form-control rounded"
                placeholder="Correo electrónico"
                required
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
              <label htmlFor="email">Correo electrónico</label>
            </div>
            <div className="form-floating mb-3">
              <input
                className="form-control rounded"
                id="name"
                placeholder="Nombre"
                required
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
              />
              <label htmlFor="name">Nombre</label>
            </div>
            <button
              type="submit"
              className="btn btn-primary align-self-center rounded text-white"
            >
              Ingresar
            </button>
          </form>
        ) : (
          <Form onSubmit={wrapSubmit(finalizeAuth)}>
            <FloatingLabel controlId="code" label="Código" className="mb-3">
              <Form.Control
                required
                placeholder="Código"
                value={code}
                onChange={(e) => setCode(e.currentTarget.value)}
              />
            </FloatingLabel>
            <Button
              type="submit"
              className="align-self-center rounded text-white"
            >
              Ingresar
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
}
