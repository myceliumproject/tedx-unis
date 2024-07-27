import { urlApi } from "$/environment";
import EventBlock from "$/lib/components/EventBlock";
import Stage from "$/lib/components/Stage";
import { useUser } from "$/lib/hooks/user";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  Image,
  Modal,
  ModalBody,
  ModalHeader,
  ModalTitle,
  Row,
  Stack,
} from "react-bootstrap";
import {
  MdCameraAlt,
  MdLooks3,
  MdLooksOne,
  MdLooksTwo,
  MdManageAccounts,
  MdSave,
} from "react-icons/md";
import { Link } from "react-router-dom";

export default function ListaBloques() {
  const [eventBlocks, setEventBlocks] = useState([]);
  const [modalEdit, setModalEdit] = useState(false);
  const [currentEdit, setCurrentEdit] = useState({});
  const [user] = useUser();

  useEffect(() => {
    axios.get(urlApi + `/eventblock/list`).then((res) => {
      if (res.data.code === 0) {
        // console.log(res.data);
        setEventBlocks(res.data.data);
      }
    });
  }, []);

  const handleChange = (campo, valor) => {
    let temp = { ...currentEdit };

    temp[campo] = valor;

    setCurrentEdit(temp);
  };

  const handleChangeEvents = (index, campo, valor) => {
    let temp = { ...currentEdit };
    temp.events[index][campo] = valor;
    setCurrentEdit(temp);
  };

  const submitChange = () => {
    axios
      .patch(urlApi + `/admin/update/block/${currentEdit.id}`, currentEdit)
      .then((response) => {
        setEventBlocks(response.data.data);
        setModalEdit(false);
      });
  };

  return (
    <div>
      <Modal
        centered
        size="xl"
        show={modalEdit}
        onHide={() => setModalEdit(false)}
      >
        <ModalHeader closeButton>
          <ModalTitle>Editar Bloque</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Image style={{ maxHeight: "300px" }} src={currentEdit.img} />
            <br />
            <FormLabel>Imagen</FormLabel>
            <FormControl
              type="text"
              value={currentEdit.img}
              onChange={(ev) => handleChange("img", ev.currentTarget.value)}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Nombre</FormLabel>
            <FormControl
              type="text"
              value={currentEdit.name}
              onChange={(ev) => handleChange("name", ev.currentTarget.value)}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Descripción</FormLabel>
            <FormControl
              as="textarea"
              value={currentEdit.description}
              onChange={(ev) =>
                handleChange("description", ev.currentTarget.value)
              }
            />
          </FormGroup>
          <Row>
            <Col xs={12}>
              <FormGroup>
                <FormLabel>Fecha</FormLabel>
                <FormControl
                  type="date"
                  value={currentEdit.date}
                  onChange={(ev) =>
                    handleChange("date", ev.currentTarget.value)
                  }
                />
              </FormGroup>
            </Col>
            <Col xs={12} md={6}>
              <FormGroup>
                <FormLabel>Hora Inicial</FormLabel>
                <FormControl
                  type="time"
                  value={currentEdit.initial_time}
                  onChange={(ev) =>
                    handleChange("initial_time", ev.currentTarget.value)
                  }
                />
              </FormGroup>
            </Col>
            <Col xs={12} md={6}>
              <FormGroup>
                <FormLabel>Hora Final</FormLabel>
                <FormControl
                  type="time"
                  value={currentEdit.final_time}
                  onChange={(ev) =>
                    handleChange("final_time", ev.currentTarget.value)
                  }
                />
              </FormGroup>
            </Col>
          </Row>
          <br />
          <ModalTitle>Eventos</ModalTitle>
          <Row>
            {currentEdit?.events?.map((e, i) => (
              <Col key={i} xs={12} lg={4}>
                {i === 0 ? (
                  <MdLooksOne
                    style={{ fontSize: "44px" }}
                    className="text-primary"
                  />
                ) : i === 1 ? (
                  <MdLooksTwo
                    style={{ fontSize: "44px" }}
                    className="text-primary"
                  />
                ) : (
                  <MdLooks3
                    style={{ fontSize: "44px" }}
                    className="text-primary"
                  />
                )}
                <br />
                <FormGroup>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl
                    type="text"
                    value={e.name}
                    onChange={(ev) =>
                      handleChangeEvents(i, "name", ev.currentTarget.value)
                    }
                  />
                </FormGroup>
                <br />
                <FormGroup>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl
                    as="textarea"
                    value={e.description}
                    onChange={(ev) =>
                      handleChangeEvents(
                        i,
                        "description",
                        ev.currentTarget.value
                      )
                    }
                  />
                </FormGroup>
                <br />
                <FormGroup>
                  <FormLabel>Orador/a</FormLabel>
                  <FormControl
                    type="text"
                    value={e.speaker}
                    onChange={(ev) =>
                      handleChangeEvents(i, "speaker", ev.currentTarget.value)
                    }
                  />
                </FormGroup>
                <br />
                <FormGroup>
                  <FormLabel>Imagen Orador/a</FormLabel>
                  <FormControl
                    type="text"
                    value={e.speakerImg}
                    onChange={(ev) =>
                      handleChangeEvents(
                        i,
                        "speakerImg",
                        ev.currentTarget.value
                      )
                    }
                  />
                  <br />
                  <Image style={{ maxWidth: "100%" }} src={e.speakerImg} />
                </FormGroup>
              </Col>
            ))}
          </Row>
          <br />
          <Stage
            canSelectTaken
            selected={null}
            onSelect={(seat) => {
              const tempBlockedSeats = [...currentEdit.blockedSeats];
              if (!tempBlockedSeats.includes(seat)) {
                tempBlockedSeats.push(seat);
              } else {
                tempBlockedSeats.splice(tempBlockedSeats.indexOf(seat), 1);
              }
              setCurrentEdit({
                ...currentEdit,
                blockedSeats: tempBlockedSeats,
              });
            }}
            taken={[]}
            extraBlocked={currentEdit.blockedSeats}
          />
          <div style={{ display: "flex", justifyContent: "end" }}>
            <Button variant="primary" onClick={submitChange}>
              <MdSave /> Guardar
            </Button>
          </div>
        </ModalBody>
      </Modal>
      <h1 className="text-center">Acciones</h1>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
        className="gap-2"
      >
        <Button as={Link} to={"/staff/ticket"}>
          <MdCameraAlt /> Validar ticket
        </Button>
        {user?.userType === "staff" || user?.userType === "admin" ? (
          <Button as={Link} to={"/staff/users"}>
            <MdManageAccounts /> Usuarios registrados
          </Button>
        ) : null}
      </div>
      <h1 className="text-center">Foro</h1>
      <Stack gap={3}>
        {eventBlocks.map((eb, i) => (
          <EventBlock
            key={i}
            page="staff"
            data={eb}
            setModalEdit={setModalEdit}
            setCurrentEdit={setCurrentEdit}
          />
        ))}
      </Stack>
    </div>
  );
}
