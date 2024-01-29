import { urlApi } from "$/environment";
import EventBlock from "$/lib/components/EventBlock";
import axios from "axios";
import { useEffect, useState } from "react";
import { Form, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";

export default function Attendance() {
  const { id: eventBlockId } = useParams();
  const [eventBlock, setEventBlock] = useState(null);
  const [search, setSearch] = useState("");
  const [attendedUsers, setAttendedUsers] = useState([]);
  const [attendedFilteredUsers, setAttendedFilteredUsers] = useState([]);

  useEffect(() => {
    axios.get(urlApi + `/eventblock/get/${eventBlockId}`).then((res) => {
      if (res.data.code === 0) {
        // console.log(res.data);
        setEventBlock(res.data.data);
        setAttendedUsers(res.data.data.takenSeatAssignments);
        setAttendedFilteredUsers(res.data.data.takenSeatAssignments);
      }
    });
  }, [eventBlockId]);

  useEffect(() => {
    setAttendedFilteredUsers(
      attendedUsers.filter((user) => {
        if (search === "") {
          return user;
        } else if (
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.seat.toLowerCase().includes(search.toLowerCase())
        ) {
          return user;
        }
      })
    );
  }, [search]);

  return (
    <div>
      <EventBlock data={eventBlock} />

      <h3 className="text-center mt-3">Lista de Asistencia</h3>
      <Form.Control
        className="mb-2"
        type="search"
        placeholder="Buscar Asistencia"
        onChange={(e) => setSearch(e.target.value)}
      />
      <Table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Lugar Reservado</th>
            <th>Estado de Asistencia</th>
          </tr>
        </thead>
        <tbody>
          {attendedFilteredUsers.map((e, i) => (
            <tr key={i}>
              <td>{e.name}</td>
              <td>{e.seat}</td>
              <td>
                {e.attended
                  ? "Asistencia Confirmada"
                  : "Reservación Confirmada"}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
