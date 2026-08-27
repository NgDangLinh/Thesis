import './RoomCard.css';
import { FaBed, FaMapMarkerAlt, FaRulerCombined, FaUser } from 'react-icons/fa';

const RoomCard = ({ room, onReserve }) => {
  if (!room) {
    return <div className="room-card">No stay data available.</div>;
  }

  return (
    <article className="room-card">
      <div className="room-card__image">
        <img src={room.image} alt={room.name} />
      </div>

      <div className="room-card__info">
        <div className="room-card__heading">
          <div>
            <p>{room.type}</p>
            <h2 className="room-card__title">{room.name}</h2>
          </div>

          <div className="room-card__price">
            <span>{room.price.toLocaleString()} VND</span>
            <small>per night</small>
          </div>
        </div>

        <div className="room-card__features">
          <div className="room-card__feature">
            <FaMapMarkerAlt className="icon" />
            <span>{room.view}</span>
          </div>

          <div className="room-card__feature">
            <FaRulerCombined className="icon" />
            <span>{room.area} sqm</span>
          </div>

          <div className="room-card__feature">
            <FaBed className="icon" />
            <span>{room.bed}</span>
          </div>

          <div className="room-card__feature">
            <FaUser className="icon" />
            <span>Up to {room.capacity} guests</span>
          </div>
        </div>

        <div className="room-card__details">
          <div>
            <strong>Included</strong>

            <ul>
              {(room.includes || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <strong>Policies</strong>

            <ul>
              {(room.policies || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="room-card__bottom">
          <div
            className={
              room.remaining > 0
                ? 'room-card__availability'
                : 'room-card__availability sold-out'
            }
          >
            {room.remaining > 0
              ? `${room.remaining} stays left`
              : 'Sold out'}
          </div>

          <button
            className="book-btn"
            disabled={room.remaining === 0}
            type="button"
            onClick={() => onReserve(room)}
          >
            Reserve
          </button>
        </div>
      </div>
    </article>
  );
};

export default RoomCard;