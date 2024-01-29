import { urlApi } from "$/environment";
import EventBlock from "$/lib/components/EventBlock";
import axios from "axios";
import { useLayoutEffect, useState } from "react";
import {
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

export default function ListaBloques() {
  const [eventBlocks, setEventBlocks] = useState([]);
  const [modalEdit, setModalEdit] = useState(false);
  const [currentEdit, setCurrentEdit] = useState({});

  useLayoutEffect(() => {
    axios.get(urlApi + `/eventblock/list`).then((res) => {
      if (res.data.code === 0) {
        // console.log(res.data);
        setEventBlocks(res.data.data);
      }
    });
  }, []);

  const handleChange = (campo, valor) => {
    let temp = { ...currentEdit };

    if (campo === "fecha" || campo === "hora") {
      let tempDate = temp.datetime.split("T");
      if (campo === "fecha") {
        tempDate[0] = valor;
      } else if (campo === "hora") {
        tempDate[1] = valor;
      }
      temp.datetime = tempDate.join("T");
    } else {
      temp[campo] = valor;
    }

    setCurrentEdit(temp);
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
          <br />
          <Row>
            <Col xs={12} md={6}>
              <FormGroup>
                <FormLabel>Fecha</FormLabel>
                <FormControl
                  type="date"
                  value={currentEdit.datetime?.split("T")[0]}
                  onChange={(ev) => handleChange("fecha", ev.currentTarget.value)}
                />
              </FormGroup>
            </Col>
            <Col xs={12} md={6}>
              <FormGroup>
                <FormLabel>Hora</FormLabel>
                <FormControl
                  type="time"
                  value={currentEdit.datetime?.split("T")[1]}
                  onChange={(ev) => handleChange("hora", ev.currentTarget.value)}
                />
              </FormGroup>
            </Col>
          </Row>
          <br />
          <ModalTitle>Eventos</ModalTitle>
        </ModalBody>
      </Modal>
      <h1 className="text-center">Bloques</h1>
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
