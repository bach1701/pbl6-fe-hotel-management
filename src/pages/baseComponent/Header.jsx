import { useRoomCount } from '../home/RoomCountContext/RoomCountContext';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API_BASE_URL from "../../config/apiConfig";
import { apiRequest } from "../../utils/api";
import { useLocation } from 'react-router-dom';

const Header = () => {
    const [profileUser, setProfileUser] = useState({});
    const [inforUser, setInforUser] = useState({});
    const [validToken, setValidToken] = useState(false);
    const { roomCount } = useRoomCount();
    const location = useLocation();
    const { setRoomCount } = useRoomCount();
    const baseURL = API_BASE_URL;
    const token = localStorage.getItem('accessToken');
    const [imageUrl, setImageUrl] = useState(''); 

    const defaultImage = 'https://demo-8000.nguyentanloc.top//media/user_11/11_Zxu1kwM.10813375.png'; 

    const handleScroll = (sectionId) => {
        window.location.href = `/`; 
        setTimeout(() => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);
    };

    useEffect(() => {
        const fetchProfile = async () => {
            if (token) {
                const URL = `${API_BASE_URL}/user/api/userauths/profile/`;
                try {
                    const response = await apiRequest(URL);
                    setProfileUser(response.data.profile);
                    setInforUser(response.data.user);
                    setValidToken(true);
                    // Kiểm tra ảnh
                    const profileImageUrl = API_BASE_URL + response.data.profile.image;
                    const img = new Image();
                    img.src = profileImageUrl;
                    img.onload = () => setImageUrl(profileImageUrl);
                    img.onerror = () => setImageUrl(defaultImage);
                } catch (err) {
                    console.error(err);
                    setValidToken(false);
                }
            } else {
                setValidToken(false);
            }
        };

        fetchProfile();
        fetchCartItemCount();
    }, [location]);

    const fetchCartItemCount = async () => {
        const urlAPIGetCartCount = `${baseURL}/api/get_cart_item_count/`; 
        try {
            const response = await apiRequest(urlAPIGetCartCount);
            const totalItems = response.data.total_items_in_cart; 
            console.log('Total items in cart:', totalItems); 
            setRoomCount(totalItems);
        } catch (error) {
            console.error('Error fetching cart count', error);
        }
    };

    const handleLogout = (redirectUrl) => {
        localStorage.removeItem('accessToken');
        window.location.href = redirectUrl;
    };
    
    return (
        <>
            <header id="header_part" className="fullwidth">
                <div id="header">
                    <div className="container">
                        <div className="utf_left_side">
                            <div id="logo"><img src="images/logo-booking-hotel.png" alt=""/></div>
                            <div className="mmenu-trigger">
                                <button className="hamburger utfbutton_collapse" type="button">
                                    <span className="utf_inner_button_box">
                                        <span className="utf_inner_section"></span>
                                    </span>
                                </button>
                            </div>
                            <nav id="navigation" className="style_one">
                                <ul id="responsive">
                                    <li><Link to="/" onClick={() => handleScroll('')}>Home</Link></li>
                                    <li><a onClick={() => handleScroll('about-us')}>About Us</a></li>
                                    <li><a onClick={() => handleScroll('contact')}>Contact</a></li>
                                </ul>
                            </nav>
                            <div className="clearfix"></div>
                        </div>
                        <div className="utf_right_side">
                            {validToken ? (
                                <div className="header_widget"> 
                                    <Link to={`/selected-room`} className="button border sign-in popup-with-zoom-anim">
                                        <i className="fa fa-bed"></i>{roomCount}
                                    </Link>
                                    <div className="utf_user_menu">
                                        <Link to={`/user-profile/my-profile`}>
                                            <div className="utf_user_name">
                                                <span><img style={{marginLeft: '10px', height: '40px'}} src={imageUrl} alt="" /></span>Hi, {inforUser.username}!
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="header_widget"> 
                                    <Link 
                                        to="#" 
                                        className="button border sign-in popup-with-zoom-anim" 
                                        onClick={() => handleLogout('/login')}
                                    >
                                        <i className="fa fa-sign-in"></i>Login
                                    </Link>
                                    <Link 
                                        to="#" 
                                        className="button border sign-in popup-with-zoom-anim" 
                                        onClick={() => handleLogout('/register')}
                                    >
                                        <i className="fa fa-plus"></i>Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;