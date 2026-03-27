import { Button, Card } from "react-bootstrap";
import { AiOutlineInstagram, AiOutlineLinkedin } from "react-icons/ai";

export default function Profile({ image, name, linkedin, instagram, song }) {
  return (
    <>
      <Card className="profile-card">
        <Card.Img variant="top" src={image} className="rounded-circle" />
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <div>
            <Button
              variant="warning"
              className="d-flex gap-1 justify-content-center align-items-center"
              href={linkedin}
              target="_blank"
            >
              <AiOutlineLinkedin />
              LinkedIn
            </Button>
          </div>
          <div className="mt-2">
            <Button
              variant="light"
              className="d-flex gap-1 justify-content-center align-items-center"
              href={instagram}
              target="_blank"
            >
              <AiOutlineInstagram />
              Instagram
            </Button>
          </div>
          <div className="mt-2">
            <iframe
              src={song}
              width="100%"
              height="152"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
