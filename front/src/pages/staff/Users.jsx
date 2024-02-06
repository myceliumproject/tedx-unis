import { urlApi } from "$/environment";
import { useUser } from "$/lib/hooks/user";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Modal, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import useEvent from "react-use-event-hook";

function UserRow({ user, setUser, setSelectedUser }) {
  const [loginnedUser] = useUser();

  const [selectedType, setSelectedType] = useState(user.userType);

  const [showWarningModal, setShowWarningModal] = useState(false);

  const changeUserType = useEvent(() => {
    axios
      .post(urlApi + `/user/changetype`, {
        userId: user.id,
        type: selectedType,
      })
      .then(() => {
        setUser({ ...user, userType: selectedType });
        setShowWarningModal(false);
      });
  });

  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>
        <Button
          disabled={user.tickets.length === 0}
          onClick={() => setSelectedUser(user)}
        >
          {user.tickets.length} Tickets
        </Button>
      </td>
      {loginnedUser?.userType === "admin" ? (
        <td>
          <Form.Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.currentTarget.value)}
          >
            <option value="user">Normal</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </Form.Select>
          <Button
            disabled={user.userType === selectedType}
            onClick={() => setShowWarningModal(true)}
          >
            Cambiar
          </Button>
        </td>
      ) : null}
      <Modal show={showWarningModal} onHide={() => setShowWarningModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Cambiando rol a{" "}
            {{ user: "normal", staff: "staff", admin: "admin" }[selectedType]}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Seguro que quieres cambiar el rol de {user.name} ({user.email}) a{" "}
          {{ user: "normal", staff: "staff", admin: "admin" }[selectedType]}?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            onClick={() => setShowWarningModal(false)}
          >
            Regresar
          </Button>
          <Button
            onClick={() => {
              setShowWarningModal(true);
              changeUserType();
            }}
          >
            Sí, seguro
          </Button>
        </Modal.Footer>
      </Modal>
    </tr>
  );
}

export default function Users() {
  const [eventBlocks, setEventBlocks] = useState([]);
  const [users, setUsers] = useState([]);
  const [user] = useUser();

  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    axios.get(urlApi + `/user/list`).then((res) => {
      if (res.data.code === 0) {
        setUsers(res.data.data);
      }
    });
  }, []);

  useEffect(() => {
    axios.get(urlApi + `/eventblock/list`).then((res) => {
      if (res.data.code === 0) {
        setEventBlocks(res.data.data);
      }
    });
  }, []);

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Tickets</th>
            {user?.userType === "admin" ? <th>Acciones</th> : null}
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <UserRow
              key={i}
              user={u}
              setUser={(u) => {
                const tempUsers = [...users];
                tempUsers[i] = u;
                setUsers(tempUsers);
              }}
              setSelectedUser={setSelectedUser}
            />
          ))}
        </tbody>
      </Table>
      <Modal show={selectedUser !== null} onHide={() => setSelectedUser(null)}>
        {selectedUser === null ? (
          <Modal.Body className="text-center">
            <Spinner />
          </Modal.Body>
        ) : (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Tickets de {selectedUser.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedUser.tickets.map((t, i) => (
                <div key={i} className="border p-2 mb-2">
                  <ul>
                    <li>
                      Bloque: {eventBlocks.find((e) => e.id === t.blockId).name}
                    </li>
                    <li>Asiento: {t.seat}</li>
                    <li>
                      <Link to={t.token}>Ver ticket</Link>
                    </li>
                  </ul>
                </div>
              ))}
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setSelectedUser(null)}>Regresar</Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
}
