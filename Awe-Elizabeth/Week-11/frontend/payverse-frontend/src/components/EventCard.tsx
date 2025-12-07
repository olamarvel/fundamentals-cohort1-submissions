import { EventType } from "../types/Event";

interface Props {
  event: EventType;
}

const EventCard = ({ event }: Props) => {
  return (
    <div style={{ border: "1px solid #ddd", padding: 14, marginBottom: 14 }}>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p><strong>Date:</strong> {new Date(event.eventDate).toLocaleString()}</p>
      <p><strong>Location:</strong> {event.location}</p>
    </div>
  );
};

export default EventCard;
