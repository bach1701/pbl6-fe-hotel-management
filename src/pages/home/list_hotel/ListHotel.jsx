import React, {useState, useEffect} from "react"
import { useLocation } from 'react-router-dom';
import axios from "axios"
import { useAuth } from '../../auth/AuthContext';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../../../config/apiConfig';
import { apiRequest } from "../../../utils/api";
import { useNavigate } from 'react-router-dom';




const ListHotel = ()=> {

    const query = new URLSearchParams(useLocation().search);
    const initialHotelName = query.get('name');
    const [hotelNames, setHotelNames] = useState(initialHotelName);
    const [searchTerm, setSearchTerm] = useState(initialHotelName);
    const [hotels, setHotels] = useState([]);
    const { token } = useAuth();
    const [error, setError] = useState(null);
    const [location, setLocation] = useState({ latitude: null, longitude: null, city: null });
    const [currentLocation, setCurrentLocation] = useState('');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);

    console.log(initialHotelName);
    console.log(token);

    const changeFilterPrice = (type, quantity) => {
        if(type === 'min') {
            setMinPrice(prev => Math.max(prev + quantity, 0));
        }
        else {
            setMaxPrice(prev => Math.max(prev + quantity, 0));
        }
    }

    const calculateAverageRating = (reviews) => {
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (totalRating / reviews.length).toFixed(1); 
    };

    const handleGetLocationUser = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    setLocation({ latitude: lat, longitude: lon });
                    await fetchCityName(lat, lon);
                },
                (err) => {
                    setError(err.message);
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    };

    const fetchCityName = async (lat, lon) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
            const city = response.data.address.city || response.data.address.town || response.data.address.village || "Unknown location";
            setLocation((prev) => ({ ...prev, city }));
            alert(`Your current location is ${city}`);
            setCurrentLocation(city);
        } catch (error) {
            console.error("Error fetching city name:", error);
            setError("Could not fetch city name.");
        }
    };

    // const fetchHotels = async(hotelNames) => {
    //     const baseURL = `${API_BASE_URL}/api/hotels/`;
    //     let url = baseURL 
    //     if(hotelNames) {
    //         url += `?name=${encodeURIComponent(hotelNames)}`;
    //     }
    //     try {
    //         const response = await axios.get(url);
    //         console.log(response.data);
    //         setHotels(response.data);
    //         const hotelsWithRatings = response.data.map(hotel => ({
    //             ...hotel,
    //             averageRating: calculateAverageRating(hotel.reviews)
    //         }));
    //         setHotels(hotelsWithRatings);
    //     } catch (err) {
    //         setError(err);
    //     }
    // }

    const fetchHotels = async(hotelNames, location) => {
        if(hotelNames == null) {
            hotelNames = "";
        }
        if(location == null) {
            location = "";
        }
        try {
            const data = {
                location: location, 
                name: hotelNames      
            };
            const response = await apiRequest(`${API_BASE_URL}/api/locations/hotels_by_location/`, 'POST', data, {});
            console.log(response.data);
            setHotels(response.data);
            const hotelsWithRatings = response.data.map(hotel => ({
                ...hotel,
                averageRating: calculateAverageRating(hotel.reviews)
            }));
            setHotels(hotelsWithRatings);
        } catch (err) {
            setError(err);
        }
    }
    useEffect(() => {       
        fetchHotels(hotelNames, currentLocation);
    },[hotelNames, currentLocation]);

    return (
        <>
            <div id="main_wrapper">
                {/* <Header /> */}
                <div class="clearfix"></div>
                <div id="titlebar" class="gradient">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-12 padding-top-60">
                                <h2>List Hotel</h2>
                                <nav id="breadcrumbs">
                                    <ul>
                                        <li><a href="index_1.html">Home</a></li>
                                        <li>List Hotel</li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 col-md-8">
                            <div class="listing_filter_block">
                                <div class="col-md-2 col-xs-2">
                                    <div class="utf_layout_nav"> <a href="#" class="list active"><i class="fa fa-align-justify"></i></a> </div>
                                </div>
                                <div class="col-md-10 col-xs-10">
                                    <div class="sort-by">
                                        <div class="utf_sort_by_select_item sort_by_margin">
                                            <select data-placeholder="Sort by Listing" class="utf_chosen_select_single"> 
                                                <option>Sort</option>
                                                <option>Price (Low to High)</option>
                                                <option>Price (High to Low)</option>
                                                <option>Highest Reviewe</option>
                                                <option>Lowest Reviewe</option>                  
                                            </select>
                                        </div>
                                    </div>
                                    <div class="sort-by">
                                        <div class="utf_sort_by_select_item utf_search_map_section">
                                            <ul>
                                                <li><a class="utf_common_button" onClick={handleGetLocationUser}><i class="fa fa-dot-circle-o"></i>Near Me</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="sort-by">
                                        <div class="utf_sort_by_select_item utf_search_map_section">
                                            <ul>
                                                <li><a class="utf_common_button" onClick={handleGetLocationUser}><i class="fa fa-list"></i>All</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <ul>
                                    {hotels.map(hotel =>(
                                        <li key={hotel.id}>
                                            <div class="col-lg-12 col-md-12">
                                                <div class="utf_listing_item-container list-layout">
                                                    <Link to={`/detailhotel/${hotel.slug}`} className="utf_listing_item">
                                                        <div class="utf_listing_item-image">
                                                            <img src={hotel.hotel_gallery[1].image} alt=""/>
                                                            <p>{hotel.map_image}</p>
                                                            <span class="like-icon"></span>
                                                            {/* <span class="tag"><i class="im im-icon-Hotel"></i> Hotels</span> */}
                                                            <div class="utf_listing_prige_block utf_half_list">
                                                                <span class="utf_meta_listing_price"><i class="fa fa-tag"></i>${hotel.price_min} - ${hotel.price_max}</span>
                                                                {/* <span class="utp_approve_item"><i class="utf_approve_listing"></i></span> */}
                                                            </div>
                                                        </div>
                                                        <span class="utf_open_now">Open Now</span>
                                                        <div class="utf_listing_item_content">
                                                            <div class="utf_listing_item-inner">
                                                                <h3>{hotel.name}</h3>
                                                                <span><i class="fa fa-map-marker"></i>{hotel.address}</span>
                                                                <span><i class="fa fa-phone"></i>{hotel.mobile}</span>
                                                                <div class="utf_star_rating_section" data-rating="4.5">
                                                                    <div class="utf_counter_star_rating">({hotel.averageRating})</div>
                                                                </div>
                                                                <p>{hotel.description}</p>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div class="clearfix"></div>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="utf_pagination_container_part margin-top-20 margin-bottom-70">
                                        <nav class="pagination">
                                            <ul>
                                                <li><a href="#"><i class="sl sl-icon-arrow-left"></i></a></li>
                                                <li><a href="#" class="current-page">1</a></li>
                                                <li><a href="#">2</a></li>
                                                <li><a href="#">3</a></li>
                                                <li><a href="#">4</a></li>
                                                <li><a href="#"><i class="sl sl-icon-arrow-right"></i></a></li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-4">
                                <div class="utf_box_widget margin-bottom-35">
                                    <h3><i class="sl sl-icon-direction"></i> Filters</h3>
                                    {/* <div class="row with-forms">
                                        <div class="col-md-12">
                                            <input type="text" placeholder="What are you looking for?" 
                                            value={searchTerm} 
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div> */}
                                    <div class="row with-forms">
                                        <div class="col-md-12">
                                            <div class="input-with-icon location">
                                                <input type="text" placeholder="Search Location..." value="" />
                                                <a href="#"><i class="sl sl-icon-location"></i></a> </div>
                                        </div>
                                    </div>
                                    <div class="qtyButtons">
                                        <div class="qtyTitle">Min Price</div>
                                        <button className="btn-decrement" style={{width:'40px', border:'none' }}
                                         onClick={() => changeFilterPrice('min', -50)}>-</button>
                                        <input type="text" name="min" value={minPrice}/>
                                        <button className="btn-increment" style={{width:'40px', border:'none' }}
                                         onClick={() => changeFilterPrice('min', 50)}>+</button>
                                    </div>
                                    <div class="qtyButtons">
                                        <div class="qtyTitle">Max Price</div>
                                        <button className="btn-decrement" style={{width:'40px', border:'none' }}
                                         onClick={() => changeFilterPrice('max', -50)}>-</button>
                                        <input type="text" name="max" value={maxPrice}/>
                                        <button className="btn-increment" style={{width:'40px', border:'none' }}
                                         onClick={() => changeFilterPrice('max', 50)}>+</button>
                                    </div>
                                    <a href="#" class="more-search-options-trigger margin-bottom-10" data-open-title="More Filters Options" data-close-title="More Filters Options"></a>
                                    {/* <div class="more-search-options relative">
                                        <div class="checkboxes one-in-row margin-bottom-15">
                                            <input id="check-a" type="checkbox" name="check"/>
                                            <label for="check-a">Real Estate</label>
                                            <input id="check-b" type="checkbox" name="check"/>
                                            <label for="check-b">Friendly Workspace</label>
                                            <input id="check-c" type="checkbox" name="check"/>
                                            <label for="check-c">Instant Book</label>
                                            <input id="check-d" type="checkbox" name="check"/>
                                            <label for="check-d">Wireless Internet</label>
                                            <input id="check-e" type="checkbox" name="check"/>
                                            <label for="check-e">Free Parking</label>
                                            <input id="check-f" type="checkbox" name="check"/>
                                            <label for="check-f">Elevator in Building</label>
                                            <input id="check-g" type="checkbox" name="check"/>
                                            <label for="check-g">Restaurant</label>
                                            <input id="check-h" type="checkbox" name="check"/>
                                            <label for="check-h">Dance Floor</label>
                                        </div>
                                    </div> */}
                                    <button class="button fullwidth_block margin-top-5">Apply</button>
                                </div>
                        </div>
                    </div>
                </div>

                {/* <section class="utf_cta_area_item utf_cta_area2_block">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="utf_subscribe_block clearfix">
                                    <div class="col-md-8 col-sm-7">
                                        <div class="section-heading">
                                            <h2 class="utf_sec_title_item utf_sec_title_item2">Subscribe to Newsletter!</h2>
                                            <p class="utf_sec_meta">
                                                Subscribe to get latest updates and information.
                                            </p>
                                        </div>
                                    </div>
                                    <div class="col-md-4 col-sm-5">
                                        <div class="contact-form-action">
                                            <form method="post">
                                                <span class="la la-envelope-o"></span>
                                                <input class="form-control" type="email" placeholder="Enter your email" required=""/>
                                                <button class="utf_theme_btn" type="submit">Subscribe</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div id="footer" class="footer_sticky_part">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-2 col-sm-3 col-xs-6">
                                <h4>Useful Links</h4>
                                <ul class="social_footer_link">
                                    <li><a href="#">Home</a></li>
                                    <li><a href="#">Listing</a></li>
                                    <li><a href="#">Blog</a></li>
                                    <li><a href="#">Privacy Policy</a></li>
                                    <li><a href="#">Contact</a></li>
                                </ul>
                            </div>
                            <div class="col-md-2 col-sm-3 col-xs-6">
                                <h4>My Account</h4>
                                <ul class="social_footer_link">
                                    <li><a href="#">Dashboard</a></li>
                                    <li><a href="#">Profile</a></li>
                                    <li><a href="#">My Listing</a></li>
                                    <li><a href="#">Favorites</a></li>
                                </ul>
                            </div>
                            <div class="col-md-2 col-sm-3 col-xs-6">
                                <h4>Pages</h4>
                                <ul class="social_footer_link">
                                    <li><a href="#">Blog</a></li>
                                    <li><a href="#">Our Partners</a></li>
                                    <li><a href="#">How It Work</a></li>
                                    <li><a href="#">Privacy Policy</a></li>
                                </ul>
                            </div>
                            <div class="col-md-2 col-sm-3 col-xs-6">
                                <h4>Help</h4>
                                <ul class="social_footer_link">
                                    <li><a href="#">Sign In</a></li>
                                    <li><a href="#">Register</a></li>
                                    <li><a href="#">Add Listing</a></li>
                                    <li><a href="#">Pricing</a></li>
                                    <li><a href="#">Contact Us</a></li>
                                </ul>
                            </div>
                            <div class="col-md-4 col-sm-12 col-xs-12">
                                <h4>About Us</h4>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore</p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="footer_copyright_part">Copyright © 2022 All Rights Reserved.</div>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div id="bottom_backto_top"><a href="#"></a></div>
            </div>

            <script src="scripts/jquery-3.4.1.min.js"></script>
            <script src="scripts/chosen.min.js"></script>
            <script src="scripts/slick.min.js"></script>
            <script src="scripts/rangeslider.min.js"></script>
            <script src="scripts/magnific-popup.min.js"></script>
            <script src="scripts/jquery-ui.min.js"></script>
            <script src="scripts/mmenu.js"></script>
            <script src="scripts/tooltips.min.js"></script>
            <script src="scripts/color_switcher.js"></script>
            <script src="scripts/jquery_custom.js"></script>

            <div id="color_switcher_preview">
                <h2>Choose Your Color <a href="#"><i class="fa fa-gear fa-spin (alias)"></i></a></h2>
                <div>
                    <ul class="colors" id="color1">
                        <li><a href="#" class="stylesheet"></a></li>
                        <li><a href="#" class="stylesheet_1"></a></li>
                        <li><a href="#" class="stylesheet_2"></a></li>
                        <li><a href="#" class="stylesheet_3"></a></li>
                        <li><a href="#" class="stylesheet_4"></a></li>
                        <li><a href="#" class="stylesheet_5"></a></li>
                    </ul>
                </div>
            </div>
        </>
    )
}
export default ListHotel