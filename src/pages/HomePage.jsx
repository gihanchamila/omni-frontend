import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedButton from '../component/button/AnimatedButton';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center min-h-[80vh] justify-center rounded-lg">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        {/* Animated Heading */}
        <motion.h2
          className="lg:text-[4rem] sm:text-3xl font-bold lg:leading-[64px]"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          A place to <span className='text-blue-500'>connect</span>, explore, and discover diverse <span className='text-blue-500'>voices and insights.</span>
        </motion.h2>

        {/* Animated Description Text */}
        <motion.span
          className="lg:text-xl sm:text-md font-light text-center block mb-4 w-3/4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          A community for sharing ideas, stories, and perspectives that broaden understanding and inspire connection. Dive into diverse voices and insights that challenge and uplift.
        </motion.span>

        {/* Animated Button */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Link to={`/signUp`}>
            <button className='transition-colors duration-100 font-medium rounded-lg text-sm px-4 py-3 focus:outline-none tracking-wider bg-blue-500 text-white hover:bg-blue-600'>
              Explore Stories
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
