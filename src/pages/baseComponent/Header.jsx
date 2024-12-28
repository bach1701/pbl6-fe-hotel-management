import axios from 'axios';
import { useRoomCount } from '../home/RoomCountContext/RoomCountContext'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API_BASE_URL from "../../config/apiConfig";
import { apiRequest } from "../../utils/api";
import { useLocation } from 'react-router-dom';

const Header = () => {
    
    const [profileUser, setProfileUser] = useState({});
    const [inforUser, setInforUser] = useState({});
    const { roomCount } = useRoomCount();
    const location = useLocation();
    const { setRoomCount } = useRoomCount();
    const baseURL = API_BASE_URL;
    const token = localStorage.getItem('accessToken');

    const handleScroll = (sectionId) => {
        window.location.href = `/`; 
        setTimeout(() => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);
    };

    useEffect (() => {
        const fetchProfile = async () => {
            if (token) {
                const URL = `${API_BASE_URL}/user/api/userauths/profile/`;
                try {
                    const response = await apiRequest(URL);
                    setProfileUser(response.data.profile);
                    setInforUser(response.data.user);
                } catch (err) {
                    console.error(err);
                }
            }
        };

        fetchProfile();
        fetchCartItemCount();
    },[location]);

    const fetchCartItemCount = async () => {
        const urlAPIGetCartCount = `${baseURL}/api/get_cart_item_count`; 
        try {
            const response = await axios.get(urlAPIGetCartCount, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const totalItems = response.data.total_items_in_cart; 
            console.log('Total items in cart:', totalItems); 
            setRoomCount(totalItems);
        } catch (error) {
            console.error('Error fetching cart count', error);
        }
    };

    return (
        <>
            <header id="header_part" class="fullwidth">
                <div id="header">
                    <div class="container">
                        <div class="utf_left_side">
                            <div id="logo"><img src="images/logo-booking-hotel.png" alt=""/></div>
                            <div class="mmenu-trigger">
                                <button class="hamburger utfbutton_collapse" type="button">
                                    <span class="utf_inner_button_box">
                                        <span class="utf_inner_section"></span>
                                    </span>
                                </button>
                            </div>
                            {/* <nav id="navigation" class="style_one">
                                <ul id="responsive">
                                    <li><a href="/">Home</a></li>
                                    <li><a href="#">User Panel</a>
                                        <ul>
                                            <li><Link to="/user-profile/history-booking">My Bookings</Link></li>
                                            <li><Link to="/user-profile/history-review">My Reviews</Link></li>
                                            <li><Link to="/user-profile/my-profile">My Profile</Link></li>
                                            <li><Link to="/user-profile/change-password">Change Password</Link></li>    
                                        </ul>
                                    </li>
                                    <li><a href="#about-us">About Us</a></li>
                                    <li><a href="#">Contact</a></li> 
                                    <li><a onClick={() => handleScroll('about-us')}>About Us</a></li>
                                    <li><a onClick={() => handleScroll('contact')}>Contact</a></li>   
                                </ul>
                            </nav> */}
                            <nav id="navigation" className="style_one">
                                <ul id="responsive">
                                    <li><Link to="/" onClick={() => handleScroll('')}>Home</Link></li>
                                    <li><a href="#">User Panel</a>
                                        <ul>
                                            <li><Link to="/user-profile/history-booking">My Bookings</Link></li>
                                            <li><Link to="/user-profile/history-review">My Reviews</Link></li>
                                            <li><Link to="/user-profile/my-profile">My Profile</Link></li>
                                            <li><Link to="/user-profile/change-password">Change Password</Link></li>    
                                        </ul>
                                    </li>
                                    <li><a onClick={() => handleScroll('about-us')}>About Us</a></li>
                                    <li><a onClick={() => handleScroll('contact')}>Contact</a></li>
                                </ul>
                            </nav>
                            <div class="clearfix"></div>
                        </div>
                        <div class="utf_right_side">
                            {token ? (
                                <div className="header_widget"> 
                                    <Link to={`/selected-room`} className="button border sign-in popup-with-zoom-anim">
                                        <i className="fa fa-bed"></i>{roomCount}
                                    </Link>
                                    <div className="utf_user_menu">
                                        <Link to={`/user-profile/my-profile`}>
                                            <div className="utf_user_name">
                                                <span><img src={API_BASE_URL + profileUser.image} alt=""/></span>Hi, {inforUser.username}!
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="header_widget"> 
                                    <Link to={`/login`} className="button border sign-in popup-with-zoom-anim">
                                        <i className="fa fa-sign-in"></i>Login
                                    </Link>
                                    <Link to={`/register`} className="button border sign-in popup-with-zoom-anim">
                                        <i className="fa fa-plus"></i>Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header 