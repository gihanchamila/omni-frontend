import { NavLink } from 'react-router-dom'

const PublicNavBar = () => {
  return (
    <nav className="bg-black text-white">
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/signup">Signup</NavLink>
    </nav>
  )
}

export default PublicNavBar