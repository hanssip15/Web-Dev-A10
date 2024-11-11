import './sb-admin-2.css';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <div className='Navbar'>
            <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
                <a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
                    <div className="sidebar-brand-text mx-3">MOVIE REVIEW</div>
                </a>
                <hr className="sidebar-divider my-0"/>
                <li className='nav-item active'>
                    <Link to='/admin/dashboard' className="nav-link">
                        <span>Dashboard</span>
                    </Link>
                </li>
                <hr className='sidebar-divider'/>
                <div className='sidebar-heading'> Menu </div>
                <li className='nav-item active'>
                    <Link to='/admin/movies' className="nav-link">
                        <span>Manage Movie</span>
                    </Link>
                    <Link to='/admin/requests' className="nav-link">
                        <span>Manage Requests</span>
                    </Link>
                    <Link to='/admin/reviews' className="nav-link">
                        <span>Manage Reviews</span>
                    </Link>
                    <Link to='/admin/actors' className="nav-link">
                        <span>Manage Actors</span>
                    </Link>
                    <Link to='/admin/awards' className="nav-link">
                        <span>Manage Awards</span>
                    </Link>
                    <Link to='/admin/users' className="nav-link">
                        <span>Manage Users</span>
                    </Link>


                    <hr className="sidebar-divider my-0"/>
                </li>
            </ul>
        </div>
    );
}

export default Navbar;