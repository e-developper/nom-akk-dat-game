import { useNavigate } from 'react-router'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div>
      <button onClick={() => navigate('/simple')}>Simple Version</button>
    </div>
  )
}

export default Home