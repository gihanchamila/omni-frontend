import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const HomePage = () => {

  const navigate = useNavigate()

  return (
    <div className="flex items-center min-h-[80vh]  justify-center rounded-lg">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="lg:text-[4rem] sm:text-3xl font-bold  lg:leading-[64px]">A place to <span className='text-blue-500'>connect</span>, explore, and discover diverse <span className='text-blue-500'>voices and insights.</span> </h2>
            <span className="lg:text-xl sm:text-md font-light text-center block mb-4 w-3/4">A community for sharing ideas, stories, and perspectives that broaden understanding and inspire connection. Dive into diverse voices and insights that challenge and uplift.</span>
            <Link to={navigate(`/signUp`)}>
              <button className='transition-colors duration-100 font-medium rounded-lg text-sm px-4 py-3 focus:outline-none tracking-wider bg-blue-500 text-white hover:bg-blue-600 '>
                  Explore Stories
              </button>
            </Link>
        </div>
    </div>
  )
}

export default HomePage