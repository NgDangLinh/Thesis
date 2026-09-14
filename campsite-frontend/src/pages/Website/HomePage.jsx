import React from 'react';
import { Link } from 'react-router-dom';
import { FaTiktok } from 'react-icons/fa6';
import {
  FaCalendarAlt,
  FaFacebookF,
  FaFireAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaWifi,
} from 'react-icons/fa';
import './HomePage.css';
import Navbar from '../../components/Navbar';
import heroImage from '../../assets/HomePageCamping.jpg';
import campingImage from '../../assets/Camping.jpg';
import glampingImage from '../../assets/Glamping.jpg';
import rvImage from '../../assets/RV.jpg';
import stiltHouseImage from '../../assets/SHtest.jpg';
import serviceImage from '../../assets/Service.jpg';
import airConditioningImage from '../../assets/Ac.png';
import bbqImage from '../../assets/BBQ.png';
import cafeImage from '../../assets/Cafe.png';
import wifiImage from '../../assets/Wifi.png';
const stays = [
  {
    name: 'Forest Tent Site',
    price: '500,000 VND / person / night',
    image: campingImage,
    text: 'A quiet open-air pitch for guests who love simple nights, fresh air, and a real campfire mood.',
  },
  {
    name: 'Luxury Glamping Tent',
    price: '1,200,000 VND / person / night',
    image: glampingImage,
    text: 'Fully prepared canvas tent with a soft bed, warm lighting, private deck, and breakfast option.',
  },
  {
    name: 'Family Stilt Lodge',
    price: 'From 10,000,000 VND / night / Minimum 10 guests.',
    image: stiltHouseImage,
    text: 'A spacious shared lodge made for families, team trips, and slow evenings around the table.',
  },
  {
    name: 'Vintage Camper Van',
    price: '1,500,000 VND / person / night',
    image: rvImage,
    text: 'A compact private stay with air conditioning, queen bed, and an easy walk to the lakeside.',
  },
];

const amenities = [
  {
    image: airConditioningImage,
    label: 'Air conditioning',
  },
  {
    image: bbqImage,
    label: 'BBQ',
  },
  {
    image: cafeImage,
    label: 'Cafe',
  },
  {
    image: wifiImage,
    label: 'WiFi',
  },
];

const highlights = [
  'Private campsites surrounded by pine forest',
  'Online booking for tents, glamping, lodges, and camper vans',
  'Guided hiking, BBQ dinner, cafe, and weekend events',
];

const HomePage = () => {
  return (
    <div className="home-page">
      <Navbar />

      <main>
        <section className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="hero-overlay">
            <div className="hero-content">
              <p className="eyebrow">Wellcome to</p>
              <h1>Mojen Retreat</h1>
              <p>
                Book peaceful tent sites, comfortable glamping stays, and family lodges in a
                forest retreat designed for slow weekends outside.
              </p>
              <div className="hero-actions">
                <Link className="primary-btn" to="/booking">
                  Book your stay
                </Link>
                <a className="secondary-btn" href="#stays">
                  Explore campsites
                </a>
              </div>
            </div>

            <form className="availability-card">
              <label>
                <span>Check in</span>
                <input type="date" />
              </label>
              <label>
                <span>Check out</span>
                <input type="date" />
              </label>
              <label>
                <span>Guests</span>
                <select defaultValue="2 guests">
                  <option>1 guest</option>
                  <option>2 guests</option>
                  <option>3 guests</option>
                  <option>4+ guests</option>
                </select>
              </label>
              <label>
                <span>Stay type</span>
                <select defaultValue="Any stay">
                  <option>Any stay</option>
                  <option>Tent site</option>
                  <option>Glamping</option>
                  <option>Family lodge</option>
                  <option>Camper van</option>
                </select>
              </label>
              <Link className="search-btn" to="/booking">
                Check availability
              </Link>
            </form>
          </div>
        </section>

        <section className="intro-section">
          <div className="section-kicker">Welcome to the woods</div>
          <div className="intro-grid">
            <div>
              <h2>A nature stay with the polish of a boutique resort.</h2>
            </div>
            <div>
              <p>
                Inspired by premium hotel booking sites, this campsite experience keeps the same
                refined feeling while focusing on outdoor stays, flexible booking, and memorable
                group experiences.
              </p>
              <ul>
                {highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="stays" className="stays-section">
          <div className="section-heading">
            <p className="section-kicker">Choose your stay</p>
            <h2>Featured campsite options</h2>
          </div>
          <div className="stay-grid">
            {stays.map((stay) => (
              <article className="stay-card" key={stay.name}>
                <img src={stay.image} alt={stay.name} />
                <div className="stay-card-body">
                  <p>{stay.price}</p>
                  <h3>{stay.name}</h3>
                  <span>{stay.text}</span>
                  <Link to="/booking">View availability</Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="experience-section">
          <div className="experience-image">
            <img src={serviceImage} alt="Outdoor campsite dining" />
          </div>
          <div className="experience-content">
            <p className="section-kicker">Camp comfort</p>
            <h2>Everything is prepared before you arrive.</h2>
            <p>
              From assigned pitches to firewood, breakfast, cafe drinks, and clean shared
              facilities, guests can travel light and spend more time outside.
            </p>
            <div className="amenity-grid">
  {amenities.map((amenity) => (
    <div className="amenity-item" key={amenity.label}>
      <img src={amenity.image} alt={amenity.label} />
      <span>{amenity.label}</span>
    </div>
  ))}
</div>
          </div>
        </section>

        <section className="reviews-section">
  <div className="reviews-content">
    <p className="section-kicker">Guest reviews</p>

    <h2>What our guests say</h2>

    <div className="reviews-rating">
      <strong>4.8</strong>
      <span>/ 5</span>
    </div>

    <div className="reviews-stars">
      ★★★★★
    </div>

    <p>
      Discover what our guests have shared about their stay at Mojen Retreat.
    </p>

    <a
      className="reviews-btn"
      href="https://maps.app.goo.gl/WfMehYXkZx3SDijt5"
      target="_blank"
      rel="noopener noreferrer"
    >
      Read our reviews on Google
    </a>
  </div>
</section>

        <section className="cta-section">
          <div>
            <p className="section-kicker">Plan your escape</p>
            <h2>Ready for a night under the trees?</h2>
            <p>
              Select your dates, compare stay types, and reserve your campsite in a few simple
              steps.
            </p>
          </div>
          <Link className="primary-btn" to="/booking">
            <FaCalendarAlt />
            Start booking
          </Link>
        </section>
      </main>

      <footer className="site-footer">
  <div className="site-footer__brand">
    <strong>Mojen Camp</strong>
    <span>Forest retreat and campsite booking</span>
  </div>

  <div className="site-footer__contact">
    <strong>Contact</strong>

    <a href="tel:+84981588219">
      <FaPhone />
      <span>+84 981 588 219</span>
    </a>

    <a
      href="https://maps.app.goo.gl/WfMehYXkZx3SDijt5"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FaMapMarkerAlt />
      <span>Quan Chu, Thai Nguyen</span>
    </a>
  </div>

  <div className="site-footer__social">
    <strong>Follow us</strong>

    <div className="social-links">
      <a
        href="https://www.facebook.com/mojenretreat"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
      >
        <FaFacebookF />
        <span>Facebook</span>
      </a>

      <a
        href="https://www.tiktok.com/@mojenretreat"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="TikTok"
      >
        <FaTiktok />
        <span>TikTok</span>
      </a>
    </div>
  </div>
</footer>
    </div>
  );
};

export default HomePage;
