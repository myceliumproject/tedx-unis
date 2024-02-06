import { urlApi } from "$/environment";
import { useUser } from "$/lib/hooks/user";
import { wrapSubmit } from "$/lib/utils";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, FloatingLabel, Form, Spinner } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import useEvent from "react-use-event-hook";

export default function Auth() {
  const [user, setUser] = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [authRequested, setAuthRequested] = useState(false);

  const [code, setCode] = useState("");

  const sendAuthRequest = useEvent(async () => {
    setLoading(true);
    const res = await axios.post(urlApi + `/user/authrequest`, { email });
    if (res.data.code === 0) {
      setAuthRequested(true);
    }
    setLoading(false);
  });

  const finalizeAuth = useEvent(async () => {
    setLoading(true);
    const res = await axios.post(urlApi + `/user/auth`, { email, code });
    if (res.data.code === 0) {
      setUser(res.data.data);
    }
    setLoading(false);
  });

  const changeName = useEvent(async () => {
    setLoading(true);
    const res = await axios.post(urlApi + `/user/changename`, { name });
    if (res.data.code === 0) {
      setUser({ ...user, name });
    }
    setLoading(false);
  });

  useEffect(() => {
    if (user !== null && user.name !== "")
      navigate(searchParams.get("return") ?? "/");
  }, [navigate, searchParams, user]);

  return (
    <div className="p-3 text-center d-flex align-items-center justify-content-center align-self-center">
      <div className="border p-4 align-items-center">
        <h1 className="text-center">Iniciar Sesión</h1>
        {loading ? (
          <Spinner />
        ) : user && user.name === "" ? (
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
        ) : !authRequested ? (
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
