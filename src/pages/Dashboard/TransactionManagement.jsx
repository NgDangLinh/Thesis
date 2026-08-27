import { useNavigate } from 'react-router-dom';

export default function TransactionManagement() {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem('token', 'mocktoken');
    navigate('/');
  };

  return (
    <div>
      <h2>Revenue</h2>
      <button onClick={handleLogin}>Go to home</button>
    </div>
  );
}
