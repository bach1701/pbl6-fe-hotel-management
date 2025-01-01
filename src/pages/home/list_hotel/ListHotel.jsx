import React, {useState, useEffect} from "react"
import { useLocation } from 'react-router-dom';
import axios from "axios"
import { Link } from 'react-router-dom';
import API_BASE_URL from '../../../config/apiConfig';
import PriceRangeSlider from "../../baseComponent/RangeSlider";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ListHotel = ()=> {

    const navigate = useNavigate();
    const query = new URLSearchParams(useLocation().search);
    let initialHotelName = query.get('hotel-name');
    let initialCityName = query.get('city-name');
    let initialMinPrice = query.get('price-min');
    let initialMaxPrice = query.get('price-max');
    const [hotelNameSearch, setHotelNameSearch] = useState(initialHotelName);
    const [locationSearch, setLocationSearch] = useState(initialCityName);
    const [hotels, setHotels] = useState([]);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState({ latitude: null, longitude: null, city: null });
    const [currentLocation, setCurrentLocation] = useState('');
    const [minPrice, setMinPrice] = useState(initialMinPrice);
    const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
    const [sortOption, setSortOption] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const hotelsPerPage = 3;

    const totalPages = Math.ceil(hotels.length / hotelsPerPage);

    const indexOfLastHotel = currentPage * hotelsPerPage;
    const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
    const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    
    const handleRangeChange = (range) => {
        setMinPrice(range[0]);
        setMaxPrice(range[1]);
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
            setHotelNameSearch('');
            setLocationSearch(city);
            alert(`Your current location is ${city}`);
            navigate(`/listhotel?hotel-name=&city-name=${encodeURIComponent(city)}&price-min=0&price-max=0`); 
        } catch (error) {
            console.error("Error fetching city name:", error);
            setError("Could not fetch city name.");
        }
    };

    const fetchHotels = async(hotelNames, location, minPrice, maxPrice) => {
        console.log(hotelNames, location);
        if(hotelNames == null) {
            hotelNames = "";
        }
        if(location == null) {
            location = "";
        }
        if(minPrice == null) {
            minPrice = "";
        }
        if(maxPrice == null) {
            maxPrice = "";
        }
        try {
            const data = {
                location: location, 
                name: hotelNames,
                price_max: maxPrice,
                price_min: minPrice
                      
            };
            console.log(hotelNames, location, minPrice, maxPrice);
            const response = await axios.post(`${API_BASE_URL}/api/locations/hotels_by_location/`, data);
            console.log(response.data);
            setHotels(response.data);
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response 
                ? error.response.data.error || error.message 
                : error.message;
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: errorMessage,
                    showConfirmButton: false,
                    timer: 3000
                });
            } 
        }
    }

    useEffect(() => {       
        fetchHotels(initialHotelName, initialCityName, initialMinPrice, initialMaxPrice);
    },[initialHotelName, initialCityName, initialMinPrice, initialMaxPrice]);

    const handleSearch = () => {
        const hotelName = encodeURIComponent(hotelNameSearch);
        const cityName = encodeURIComponent(locationSearch);
        const url = `/listhotel?hotel-name=${hotelName}&city-name=${cityName}&price-min=0&price-max=0`;
        window.location.href = url;
    };

    const handleFilterHotel = () => {
        const hotelName = encodeURIComponent(hotelNameSearch);
        const cityName = encodeURIComponent(locationSearch);
        const priceMin = encodeURIComponent(minPrice);
        const priceMax = encodeURIComponent(maxPrice);
        const url = `/listhotel?hotel-name=${hotelName}&city-name=${cityName}&price-min=${priceMin}&price-max=${priceMax}`;
        window.location.href = url;
    }

    const handleSortChange = (e) => {
        const selectedOption = e.target.value;
        setSortOption(selectedOption);
        sortHotels(selectedOption);
    };

    const sortHotels = (option) => {
        let sortedHotels = [...hotels];
        switch(option) {
            case 'Price (Low to High)':
                sortedHotels.sort((a, b) => a.price_min - b.price_min);
                break;
            case 'Price (High to Low)':
                sortedHotels.sort((a, b) => b.price_min - a.price_min);
                break;
            case 'Rating (Low to High)':
                sortedHotels.sort((a, b) => a.average_rating - b.average_rating);
                break;
            case 'Rating (High to Low)':
                sortedHotels.sort((a, b) => b.average_rating - a.average_rating);
                break;
            default:
                break;
        }
        setHotels(sortedHotels);
    };

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
                            <div class="main_input_search_part second_input_search_part" style={{ marginBottom: '20px' }}>
                                <div class="sort-by">
                                    <div class="utf_sort_by_select_item utf_search_map_section" style={{paddingBottom: '20px', paddingLeft: '5px'}}>
                                        {/* <ul> */}
                                            <a class="utf_common_button" style={{ cursor: 'pointer' }} onClick={handleGetLocationUser}><i class="fa fa-location-pin"></i>Near Me</a>
                                        {/* </ul> */}
                                    </div>
                                </div>
                                <div class="main_input_search_part_item">
                                    <input type="text" placeholder="Type name of hotel..." 
                                    value={hotelNameSearch} onChange={(e)=>setHotelNameSearch(e.target.value)} />
                                </div>
                                <div class="main_input_search_part_item main-search-input-item search-input-icon">
                                    <input type="text" placeholder="Type name of city..." id="booking-date-search"
                                    value={locationSearch} onChange={(e)=>setLocationSearch(e.target.value)} />
                                </div>
                                <button class="button second_input_search_part" styple={{}} onclick="window.location.href='listings_half_screen_map_list.html'" onClick={handleSearch}>Search</button>
                            </div>
                            <div class="row">
                                <ul>
                                    {currentHotels.map(hotel => (
                                        <li key={hotel.id}>
                                            <div className="col-lg-12 col-md-12" style={{ paddingRight: '0px'}}>
                                                <div className="utf_listing_item-container list-layout">
                                                    <Link to={`/detailhotel/${hotel.slug}`} className="utf_listing_item">
                                                    <div className="utf_listing_item-image">
                                                        <img src={hotel.hotel_gallery[1].image} alt="" />
                                                        <p>{hotel.map_image}</p>
                                                        <span className="like-icon"></span>
                                                        <div className="utf_listing_prige_block utf_half_list">
                                                        <span className="utf_meta_listing_price">
                                                            <i className="fa fa-tag"></i>${hotel.price_min} - ${hotel.price_max}
                                                        </span>
                                                        </div>
                                                    </div>
                                                    <span className="utf_open_now">Open Now</span>
                                                    <div className="utf_listing_item_content">
                                                        <div className="utf_listing_item-inner">
                                                        <h3>{hotel.name}</h3>
                                                        <span><i className="fa fa-map-marker"></i>{hotel.address}</span>
                                                        <span><i className="fa fa-phone"></i>{hotel.mobile}</span>
                                                        <div className="utf_star_rating_section" data-rating="4.5">
                                                            <div className="utf_counter_star_rating">({hotel.average_rating}) / ({hotel.review_count} Reviews)</div>
                                                        </div>
                                                        <div dangerouslySetInnerHTML={{ __html: hotel.description }} />
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
                                    <div className="utf_pagination_container_part margin-top-20 margin-bottom-70">
                                        <nav className="pagination">
                                        <ul>
                                            <li>
                                            <a href="#" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                                                <i className="sl sl-icon-arrow-left"></i>
                                            </a>
                                            </li>
                                            {Array.from({ length: totalPages }, (_, index) => (
                                            <li key={index}>
                                                <a
                                                href="#"
                                                onClick={() => goToPage(index + 1)}
                                                className={currentPage === index + 1 ? 'current-page' : ''}
                                                >
                                                {index + 1}
                                                </a>
                                            </li>
                                            ))}
                                            <li>
                                            <a href="#" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                                                <i className="sl sl-icon-arrow-right"></i>
                                            </a>
                                            </li>
                                        </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-4">
                                <div class="utf_box_widget margin-bottom-35" style={{marginLeft: '10px'}}>
                                    <h3><i class="sl sl-icon-direction"></i> Filters</h3>
                                    <div class="row with-forms">
                                        <div class="col-md-12">
                                            <div className="utf_sort_by_select_item sort_by_margin" style={{ paddingTop: '20px', marginBottom: '0px' }}>
                                                <select
                                                    data-placeholder="Sort by Listing"
                                                    className="utf_chosen_select_single"
                                                    style={{ marginBottom: '0px' }}
                                                    onChange={handleSortChange}
                                                >
                                                    <option>Sort</option>
                                                    <option>Price (Low to High)</option>
                                                    <option>Price (High to Low)</option>
                                                    <option>Rating (Low to High)</option>
                                                    <option>Rating (High to Low)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <PriceRangeSlider 
                                        onRangeChange={handleRangeChange} 
                                        min={minPrice} 
                                        max={maxPrice} 
                                    />
                                    <div class="qtyButtons">
                                        <div class="qtyTitle">Min Price</div>
                                        {/* <button className="btn-decrement" style={{width:'40px', border:'none' }}
                                         onClick={() => changeFilterPrice('min', -50)}>-</button> */}
                                        <input type="text" name="min" value={minPrice}/>
                                        {/* <button className="btn-increment" style={{width:'40px', border:'none' }}
                                         onClick={() => changeFilterPrice('min', 50)}>+</button> */}
                                    </div>
                                    <div class="qtyButtons">
                                        <div class="qtyTitle">Max Price</div>
                                        {/* <button className="btn-decrement" style={{width:'40px', border:'none' }}
                                         onClick={() => changeFilterPrice('max', -50)}>-</button> */}
                                        <input type="text" name="max" value={maxPrice}/>
                                        {/* <button className="btn-increment" style={{width:'40px', border:'none' }}
                                         onClick={() => changeFilterPrice('max', 50)}>+</button> */}
                                    </div>
                                    <button class="button fullwidth_block margin-top-5" onClick={handleFilterHotel}>Apply</button>
                                </div>
                        </div>
                    </div>
                </div>
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