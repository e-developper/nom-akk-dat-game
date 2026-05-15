import { useNavigate } from 'react-router'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="game-home">
      <button onClick={() => navigate('/simple')}>Simple Version</button>
      <button onClick={() => navigate('/complete/1')}>Complete - 1 Player</button>
      <button onClick={() => navigate('/complete/2')}>Complete - 2 Player</button>
    </div>
  )
}

export default Home
