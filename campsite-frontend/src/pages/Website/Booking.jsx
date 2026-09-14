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
  view: 'Near the stream',
  bed: 'Bring your own tent and food',
  includes: [
    'Campfire area',
    'BBQ area',
    'WiFi',
    'Stream bathing',
    'Other service facilities',
    'Air conditioning',
  ],
  policies: ['Pets allowed'],
  capacity: '2–4',
  price: 500000,
  priceNote: 'per person / night',
  remaining: 6,
},
  {
  name: 'Luxury Glamping Tent',
  type: 'Glamping',
  image: glampingImage,
  view: 'Near the stream',
  bed: 'Sleeping mattresses for 2–4 guests',
  includes: [
    'Fully prepared tent',
    'Food included',
    'BBQ area',
    'Campfire area',
    'Other service facilities',
    'Air conditioning',
  ],
  policies: ['Pets allowed'],
  capacity: '2–4',
  price: 1200000,
  priceNote: 'per person / night',
  remaining: 3,
},
{
  name: 'Family Stilt Lodge',
  type: 'Lodge',
  image: stiltHouseImage,
  view: 'Beautiful stream view',
  bed: '4 bedrooms + extra mattresses for large groups',
  includes: [
    'Food included',
    'Indoor kitchen',
    'BBQ area',
    'Private garden',
    'Campfire area',
    'Private bathroom',
    'Private shower',
    'Air conditioning',
  ],
  policies: ['Pets allowed'],
  capacity: 8,
  price: 10000000,
  priceNote: 'per night / minimum 10 guests',
  remaining: 2,
},
{
  name: 'Vintage Camper Van',
  type: 'RV',
  image: rvImage,
  view: 'Near the stream',
  bed: 'Sleeping mattresses for 2–4 guests',
  includes: [
    'Food included',
    'BBQ area',
    'Campfire area',
    'Other service facilities',
    'Air conditioning',
  ],
  policies: ['Pets allowed'],
  capacity: '2–4',
  price: 1500000,
  priceNote: 'per person / night',
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
