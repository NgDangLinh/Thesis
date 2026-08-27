import { Link } from 'react-router-dom';
import logoImage from '../assets/Logo.jpg';
import './Navbar.css';

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="site-logo">
          <Link to="/home">
            <img src={logoImage} alt="Logo" className="site-logo-image" />
          </Link>
        </div>
        <nav className="site-nav" aria-label="Main navigation">
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><a href="/home#stays">Stays</a></li>
            <li><Link to="/booking">Availability</Link></li>
            <li><Link to="/login">Sign in</Link></li>
          </ul>
        </nav>
        <Link className="nav-booking-btn" to="/booking">Book now</Link>
      </div>
    </header>
  );
}
