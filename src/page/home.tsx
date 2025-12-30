import { useNavigate } from 'react-router'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div>
      <button onClick={() => navigate('/simple')}>Simple Version</button>
      <button onClick={() => navigate('/complete')}>Complete Version</button>
    </div>
  )
}

export default Home