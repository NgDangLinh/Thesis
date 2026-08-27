import { useState } from 'react';
import RoomCard from '../../components/RoomCard';
import Navbar from '../../components/Navbar';
import './Booking.css';
import campingImage from '../../assets/Camping.jpg';
import glampingImage from '../../assets/Glamping.jpg';
import rvImage from '../../assets/RV.jpg';
import stiltHouseImage from '../../assets/SHtest.jpg';
import ReservationModal from '../../components/ReservationModal';

const stayData = [
  {
    name: 'Forest Tent Site',
    type: 'Camping',
    image: campingImage,
    view: 'Pine forest',
    area: 24,
    bed: 'Bring your own tent',
    includes: ['Fire pit', 'Shared bathroom', 'Picnic table'],
    policies: ['Quiet hours after 10 PM', 'No littering'],
    capacity: 2,
    price: 290000,
    remaining: 6,
  },
  {
    name: 'Luxury Glamping Tent',
    type: 'Glamping',
    image: glampingImage,
    view: 'Stream view',
    area: 36,
    bed: '1 queen bed',
    includes: ['Breakfast option', 'Private deck', 'Warm lighting'],
    policies: ['No smoking inside', 'Pets by request'],
    capacity: 2,
    price: 790000,
    remaining: 3,
  },
  {
    name: 'Family Stilt Lodge',
    type: 'Lodge',
    image: stiltHouseImage,
    view: 'Garden and campfire yard',
    area: 64,
    bed: '4 floor mattresses',
    includes: ['Kitchen corner', 'BBQ area', 'Board games'],
    policies: ['Group deposit required', 'No loud music after 10 PM'],
    capacity: 8,
    price: 1190000,
    remaining: 2,
  },
  {
    name: 'Vintage Camper Van',
    type: 'RV',
    image: rvImage,
    view: 'Lakeside lane',
    area: 28,
    bed: '1 double bed',
    includes: ['Air conditioning', 'Mini fridge', 'Private seating'],
    policies: ['No smoking', 'Check-in from 2 PM'],
    capacity: 2,
    price: 950000,
    remaining: 1,
  },
];

const Booking = () => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2 guests');
  const [sortBy, setSortBy] = useState('Cheapest');
  const [filteredStays, setFilteredStays] = useState(stayData);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleCheck = () => {
    const sortedStays = [...stayData];

    if (sortBy === 'Cheapest') {
      sortedStays.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Highest') {
      sortedStays.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Most popular') {
      sortedStays.sort((a, b) => b.remaining - a.remaining);
    }

    setFilteredStays(sortedStays);
  };

  const handleReserve = (room) => {
  setSelectedRoom(room);
};

  return (
    <>
      <Navbar />
      <main className="booking-page">
        <section className="booking-hero">
          <p className="booking-kicker">Reserve your campsite</p>
          <h1>Find your next outdoor stay</h1>
          <p>
            Compare tent sites, glamping tents, family lodges, and camper vans with simple
            availability details.
          </p>
        </section>

        <section className="booking-form">
          <label className="booking-field">
            <span>Check in</span>
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          </label>

          <label className="booking-field">
            <span>Check out</span>
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
          </label>

          <label className="booking-field">
            <span>Guests</span>
            <select value={guests} onChange={(e) => setGuests(e.target.value)}>
              <option>1 guest</option>
              <option>2 guests</option>
              <option>3 guests</option>
              <option>4+ guests</option>
            </select>
          </label>

          <label className="booking-field">
            <span>Sort by</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="Cheapest">Cheapest</option>
              <option value="Highest">Highest price</option>
              <option value="Most popular">Most available</option>
            </select>
          </label>

          <button className="check-btn" onClick={handleCheck} type="button">
            Search stays
          </button>
        </section>

        <section className="booking-results">
          {filteredStays.map((room) => (
            <RoomCard key={room.name} room={room} onReserve={handleReserve} />
          ))}
        </section>

        {selectedRoom && (
          <ReservationModal
            room={selectedRoom}
            onClose={() => setSelectedRoom(null)}
          />
)}
      </main>
    </>
  );
};

export default Booking;
