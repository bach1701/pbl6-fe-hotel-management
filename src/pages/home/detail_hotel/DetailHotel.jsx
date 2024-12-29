import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import API_BASE_URL from '../../../config/apiConfig';
import { apiRequest } from "../../../utils/api";


const DetailHotel = () => {
    
    const token = localStorage.getItem('accessToken');
    const { slug } = useParams(); 
    const [detailHotel, setDetailHotel] = useState(null);
    const [roomTypes, setRoomTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adults, setAdults] = useState(1);
    const [childrens, setChildrens] = useState(parseInt('1'));
    const [checkin, setCheckin] = useState(''); 
    const [checkout, setCheckout] = useState('');
    const [initRoomType, setInitRoomType] = useState('');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [hotelgalleries, setHotelGalleries] = useState([]);
    const [hid, setHid] = useState('');
    const [hotelId, setHotelId] = useState(null);
    const [rating, setRating] = useState(null);
    const [review, setReview] = useState('');
    const [listHotelReviews, setListHotelReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [inforReceptionist, setInforReceptionist] = useState({});
    const [publicCoupon, setPublicCoupon] = useState([]);

    const baseURL = API_BASE_URL;

    const navigate = useNavigate();

    const changeQuantity = (type, quantity) => {
        if(type === 'adults') {
            setAdults(prev => Math.max(prev + quantity, 0));
        }
        else {
            setChildrens(prev => Math.max(prev + quantity, 0));
        }
    }
    const handleCheckinDate = (e) => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const dateCheckin = new Date(e.target.value);
        console.log('current date: ', currentDate);
        console.log('check-in date: ', dateCheckin);

        if(dateCheckin < currentDate) {
            setCheckin('');
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Ngày Checkin không hợp lệ.',
                showConfirmButton: false,
                timer: 3000
            })
        }
        else {
            setCheckin(e.target.value); 
        }
    }
    const handleCheckoutDate = (e) => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const dateCheckout = new Date(e.target.value);
        if(dateCheckout < currentDate) {
            setCheckout('');
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Ngày Checkout không hợp lệ.',
                showConfirmButton: false,
                timer: 3000
            })
        }
        else {
            if(new Date(checkin) >= new Date(dateCheckout)) {
                setCheckout('');
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Ngày Checkout không hợp lệ.',
                    showConfirmButton: false,
                    timer: 3000
                })
            }
            else {
                setCheckout(e.target.value);
            }
        } 
    }

    const handleSelectRoomType = (e) => {
        setInitRoomType(e.target.value);
    }

    const handleCheckRoomAvailability = async () => {
        if ((checkin && checkout) && (new Date(checkin) < new Date(checkout))) {
            if (initRoomType && checkin && checkout && adults && childrens) {
                const urlAPICheckRoomAvailability = `${baseURL}/booking/api/booking/check-room-availability/`;
                const data = {
                    hotel_slug: detailHotel.slug,
                    room_type: initRoomType,
                    checkin: checkin,
                    checkout: checkout,
                    adult: adults,
                    children: childrens
                };
                console.log(data);
                try {
                    const response = await axios.post(urlAPICheckRoomAvailability, data);
                    const responseData = response.data;
                    console.log('responseData : ', responseData);
                    navigate(`/checkroomavailability/${encodeURIComponent(responseData.slug)}?room-type=${encodeURIComponent(responseData.room_type)}&date-checkin=${encodeURIComponent(checkin)}&date-checkout=${encodeURIComponent(checkout)}&adults=${encodeURIComponent(adults)}&childrens=${encodeURIComponent(childrens)}`);
                } catch (error) {
                    // Xử lý lỗi khi không có phòng
                    if (error.response && error.response.data) {
                        const errorMessage = error.response 
                        ? error.response.data.error || error.message 
                        : error.message;
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi!',
                            text: errorMessage,
                            showConfirmButton: false,
                            timer: 3000
                        });
                    } else {
                        console.error('There was an error!', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi!',
                            text: 'Không thể kết nối tới server.',
                            showConfirmButton: false,
                            timer: 3000
                        });
                    }
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Nhập thiếu thông tin!',
                    text: 'Vui lòng nhập đầy đủ các thông tin cần để kiểm tra phòng trống',
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Ngày Checkout không hợp lệ!',
                text: 'Bạn vui lòng nhập lại ngày Check out',
                showConfirmButton: false,
                timer: 3000
            });
        }
    };
    
    useEffect(() => {
        const fetchHotelDetails = async () => {
            console.log('token :',token);
            try {
                const responseHotelDetail = await axios.get(`${baseURL}/api/hotels/${slug}/`);
                console.log(responseHotelDetail.data);
                setDetailHotel(responseHotelDetail.data);
                console.log(responseHotelDetail.data.hotel_gallery);
                setHotelGalleries(responseHotelDetail.data.hotel_gallery)
                setHid(responseHotelDetail.data.hid)
                console.log(responseHotelDetail.data.hid);

                const responseRoomType = await axios.get(`${baseURL}/api/hotels/${slug}/room-types/`);
                console.log(responseRoomType.data.roomtype);
                setRoomTypes(responseRoomType.data.roomtype);

                fetchHotelReview(responseHotelDetail.data.hid);
                fetchReceptionist(responseHotelDetail.data.id);
            } catch (err) {
            setError(err.message);
            } finally {
            setLoading(false);
            }
        };
      fetchPublicCoupon();
      fetchHotelDetails();
    }, [slug]);

    const fetchReceptionist = async (hid) => {
        const URL = `${baseURL}/user/api/userauths/receptionist/hotel/${hid}/`;
        try {
            const responseReceptionist = await axios.get(URL);
            console.log(responseReceptionist.data);
            setInforReceptionist(responseReceptionist.data);
        } catch (error) {
            console.log(error.message);
        }
    }
    const fetchPublicCoupon = async () => {
        const URL = `${baseURL}/api/public-coupons/`;
        try {
            const responsePublicCoupon = await axios.get(URL);
            console.log(responsePublicCoupon.data);
            setPublicCoupon(responsePublicCoupon.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    const fetchHotelReview = async (hid) => {
        try {
            const responseHotelReview = await axios.get(`${baseURL}/api/reviews/hotel-reviews/${hid}/`);
            setHotelId(responseHotelReview.data.hotel_id);
            setListHotelReviews(responseHotelReview.data.reviews);
            handleAverageRating(responseHotelReview.data.reviews);
            console.log(responseHotelReview.data.reviews);
            console.log(responseHotelReview.data);
        }
        catch (err) {
            console.log(err);
        }
    }

    const handleRoomClick = (roomType) => {
        setSelectedRoom(roomType);
    };

    const handleCloseModal = () => {
        setSelectedRoom(null);
    };

    const handleOutsideClick = (e) => {
        if (e.target.className === 'modal') {
            handleCloseModal();
        }
    };

    const handleRatingChange = (e) => {
        console.log(e.target.value);
        setRating(e.target.value);
    };
    
    const handleReviewChange = (e) => {
        console.log(e.target.value);
        setReview(e.target.value);
    };

    const handleSubmitReview = async(hotelId, rating, review) => {
        console.log(hid);
        const URL =`${baseURL}/api/reviews/post/`;
        const data = {
            hotel : hotelId,
            rating : parseInt(rating),
            review_text : review
        }

        try {
            console.log(data);
            console.log(token);
            const reponse = await axios.post(URL, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Viết đánh giá thành công.',
                showConfirmButton: false,
                timer: 2000
            })
            setRating(0);
            setReview('');
            fetchHotelReview(hid);
            console.log(reponse.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleAverageRating = (reviews) => {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = totalRating / reviews.length;
        setAverageRating(avgRating);
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0'); 
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const sec = String(date.getSeconds()).padStart(2, '0');
    
        return `${yyyy}-${mm}-${dd} - ${hh}:${min}:${sec}`;
    };

  
    if (loading) return <p>Loading hotel details...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <div id="main_wrapper">
                {/* <Header /> */}
                <div class="clearfix"></div>
                <div id="utf_listing_gallery_part" class="utf_listing_section">
                    <div class="utf_listing_slider utf_gallery_container margin-bottom-0">
                        {hotelgalleries.map(hotelgallery => (
                            <img src={`${hotelgallery.image}`} alt="" class="item utf_gallery"/>
                        ))}
                    </div>
                </div>
                <div class="container">
                    <div class="row utf_sticky_main_wrapper">
                        <div class="col-lg-8 col-md-8">
                            <div id="titlebar" class="utf_listing_titlebar">
                                <div class="utf_listing_titlebar_title">
                                    <h2>{detailHotel.name} <span class="listing-tag">Hotel</span></h2>
                                    <span> <a href="#utf_listing_location" class="listing-address"> <i class="fa fa-location-pin"></i> {detailHotel.address}</a> </span>
                                    <span class="call_now"><i class="sl sl-icon-phone"></i> {detailHotel.mobile}</span>
                                    <div class="utf_star_rating_section" data-rating="4.5">
                                        <div class="utf_counter_star_rating">({averageRating.toFixed(1)}) / ({listHotelReviews.length} Reviews)</div>
                                    </div>
                                    <ul class="listing_item_social">
                                        <li><a href="#"><i class="fa fa-bookmark"></i> Bookmark</a></li>
                                        <li><a href="#"><i class="fa fa-star"></i> Add Review</a></li>
                                        <li><a href="#"><i class="fa fa-flag"></i> Featured</a></li>
                                        <li><a href="#"><i class="fa fa-share"></i> Share</a></li>
                                        <li><a href="#" class="now_open">Open Now</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div id="utf_listing_overview" class="utf_listing_section">
                                <h3 class="utf_listing_headline_part margin-top-30 margin-bottom-30">Description</h3>
                                <p>{detailHotel.description}</p>
                                <div id="utf_listing_tags" class="utf_listing_section listing_tags_section margin-bottom-10 margin-top-0">
                                    <a href="#"><i class="sl sl-icon-phone" aria-hidden="true"></i>(+84) {detailHotel.mobile}</a>
                                    <a href="#"><i class="fa fa-envelope-o" aria-hidden="true"></i> {detailHotel.slug}@gmail.com</a>
                                    <a href="#"><i class="sl sl-icon-globe" aria-hidden="true"></i> www.{detailHotel.slug}.com</a>
                                </div>
                                <div class="social-contact">
                                    <a href="#" class="facebook-link"><i class="fa fa-facebook"></i> Facebook</a>
                                    <a href="#" class="twitter-link"><i class="fa fa-twitter"></i> Twitter</a>
                                    <a href="#" class="instagram-link"><i class="fa fa-instagram"></i> Instagram</a>
                                    <a href="#" class="linkedin-link"><i class="fa fa-linkedin"></i> Linkedin</a>
                                    <a href="#" class="youtube-link"><i class="fa fa-youtube-play"></i> Youtube</a>
                                </div>
                            </div>

                            <div id="utf_listing_tags" class="utf_listing_section listing_tags_section">
                                <h3 class="utf_listing_headline_part margin-top-40 margin-bottom-40">Tags</h3>
                                <a href="#"><i class="fa fa-tag" aria-hidden="true"></i> Food</a>
                                <a href="#"><i class="fa fa-tag" aria-hidden="true"></i> Fruits</a>
                                <a href="#"><i class="fa fa-tag" aria-hidden="true"></i> Lunch</a>
                                <a href="#"><i class="fa fa-tag" aria-hidden="true"></i> Menu</a>
                                <a href="#"><i class="fa fa-tag" aria-hidden="true"></i> Parking</a>
                                <a href="#"><i class="fa fa-tag" aria-hidden="true"></i> Restaurant</a>
                            </div>

                            <div class="utf_listing_section">
                                <h3 class="utf_listing_headline_part margin-top-50 margin-bottom-40">Pricing</h3>
                                <div class="show-more">
                                    <div class="utf_pricing_list_section">
                                        <h4>Select Pass</h4>
                                        <ul>
                                            {roomTypes.map(roomType => (
                                                <li 
                                                key={roomType.id} 
                                                onClick={() => handleRoomClick(roomType)} 
                                                style={{ cursor: 'pointer' }}
                                                >
                                                    <h5>{roomType.type}<sub class="ppl-offer label-light-success">20% Off</sub></h5>
                                                    <p><strong>Max :</strong> {roomType.room_capacity} Persons</p>
                                                    <span>${roomType.price}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {/* Modal for room details */}
                            {selectedRoom && (
                                <div className="modal" onClick={handleOutsideClick} style={modalStyles}>
                                    <div className="modal-content" style={modalContentStyles}>
                                        <span className="close" onClick={handleCloseModal} style={closeButtonStyles}>&times;</span>
                                        <h2>{selectedRoom.type}</h2>
                                        <img 
                                            src={`${baseURL}${selectedRoom.image}`} 
                                            alt={selectedRoom.type} 
                                            style={{ 
                                                maxWidth: '100%',  
                                                maxHeight: '400px', 
                                                objectFit: 'contain' 
                                            }}  
                                        />
                                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: '20px' }}>
                                            <div style={{ flex: '0 0 48%', marginBottom: '10px' }}>
                                                <p><strong>Price:</strong>${selectedRoom.price}</p>
                                            </div>
                                            <div style={{ flex: '0 0 48%', marginBottom: '10px' }}>
                                                <p><strong>Description:</strong> {selectedRoom.description}</p>
                                            </div>
                                            <div style={{ flex: '0 0 48%', marginBottom: '10px' }}>
                                                <p><strong>Number of Beds:</strong> {selectedRoom.number_of_beds}</p>
                                            </div>
                                            <div style={{ flex: '0 0 48%', marginBottom: '10px' }}>
                                                <p><strong>Room Capacity:</strong> {selectedRoom.room_capacity} Persons</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div id="utf_listing_reviews" class="utf_listing_section">
                                <h3 class="utf_listing_headline_part margin-top-75 margin-bottom-20">Reviews <span>({listHotelReviews.length})</span></h3>
                                <div class="clearfix"></div>
                                <div class="reviews-container">
                                    <div class="row">
                                        <div class="col-lg-3">
                                            <div id="review_summary">
                                                <strong>{averageRating.toFixed(1)}</strong>
                                                {/* <em>Superb Reviews</em> */}
                                                <small>Out of {listHotelReviews.length} Reviews</small>
                                            </div>
                                        </div>
                                        <div class="col-lg-9">
                                            <div class="row">
                                                <div class="col-lg-2 review_progres_title"><small><strong>Quality</strong></small></div>
                                                <div class="col-lg-9">
                                                    <div class="progress">
                                                        <div class="progress-bar" role="progressbar" style={{ width: '95%' }} aria-valuenow="95" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-1 review_progres_title"><small><strong>77</strong></small></div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-2 review_progres_title"><small><strong>Space</strong></small></div>
                                                <div class="col-lg-9">
                                                    <div class="progress">
                                                        <div class="progress-bar" role="progressbar" style={{ width: '90%' }} aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-1 review_progres_title"><small><strong>15</strong></small></div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-2 review_progres_title"><small><strong>Price</strong></small></div>
                                                <div class="col-lg-9">
                                                    <div class="progress">
                                                        <div class="progress-bar" role="progressbar" style={{ width: '70%' }} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-1 review_progres_title"><small><strong>18</strong></small></div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-2 review_progres_title"><small><strong>Service</strong></small></div>
                                                <div class="col-lg-9">
                                                    <div class="progress">
                                                        <div class="progress-bar" role="progressbar" style={{ width: '40%' }} aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-1 review_progres_title"><small><strong>10</strong></small></div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-2 review_progres_title"><small><strong>Location</strong></small></div>
                                                <div class="col-lg-9">
                                                    <div class="progress">
                                                        <div class="progress-bar" role="progressbar" style={{ width: '20%' }} aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-1 review_progres_title"><small><strong>05</strong></small></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="comments utf_listing_reviews">
                                    <ul>
                                        {listHotelReviews.map((listHotelReview)=> (
                                            <li key={listHotelReview.id}>
                                                <div class="avatar"><img src={`${baseURL}/${listHotelReview.profile_image}`} alt="" /></div>
                                                <div class="utf_comment_content">
                                                    <div class="utf_arrow_comment"></div>
                                                    <div class="utf_star_rating_section" data-rating="5"></div>
                                                    <a href="#" class="rate-review">Helpful Review <i class="fa fa-thumbs-up"></i></a>
                                                    <div class="utf_by_comment">{listHotelReview.email}<span class="date"><i class="fa fa-clock-o"></i>{formatDate(listHotelReview.date)}</span> </div>
                                                    <p>{listHotelReview.review_text}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div class="clearfix"></div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="utf_pagination_container_part margin-top-30">
                                            {/* <nav class="pagination">
                                                <ul>
                                                    <li><a href="#"><i class="sl sl-icon-arrow-left"></i></a></li>
                                                    <li><a href="#" class="current-page">1</a></li>
                                                    <li><a href="#">2</a></li>
                                                    <li><a href="#">3</a></li>
                                                    <li><a href="#"><i class="sl sl-icon-arrow-right"></i></a></li>
                                                </ul>
                                            </nav> */}
                                        </div>
                                    </div>
                                </div>
                                <div class="clearfix"></div>
                            </div>
                            <div id="utf_add_review" class="utf_add_review-box">
                                <h3 class="utf_listing_headline_part margin-bottom-20">Add Your Review</h3>
                                <span class="utf_leave_rating_title">Your email address will be published.</span>
                                <div class="row">
                                    <div class="col-md-6 col-sm-6 col-xs-12">
                                        <div class="clearfix"></div>
                                        <div class="utf_leave_rating margin-bottom-30">
                                        {[5, 4, 3, 2, 1].map((star) => (
                                            <React.Fragment key={star}>
                                                <input
                                                type="radio"
                                                name="rating"
                                                id={`rating-${star}`}
                                                value={star}
                                                onChange={handleRatingChange}
                                                checked={rating === star.toString()}
                                                />
                                                <label htmlFor={`rating-${star}`} className="fa fa-star"></label>
                                            </React.Fragment>
                                        ))}
                                        </div>
                                        <div class="clearfix"></div>
                                    </div>
                                    <div class="col-md-6 col-sm-6 col-xs-12">
                                    </div>
                                </div>
                                <div id="utf_add_comment" class="utf_add_comment">
                                    <fieldset>
                                        <div>
                                            <label>Review:</label>
                                            <textarea cols="40" placeholder="Your Message..." rows="3" value={review} onChange={handleReviewChange}></textarea>
                                        </div>
                                    </fieldset>
                                    <button class="button"
                                    onClick={() => handleSubmitReview(hotelId, rating, review)}>Submit Review</button>
                                    <div class="clearfix"></div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Sidebar --> */}
                        <div class="col-lg-4 col-md-4 margin-top-75 sidebar-search">
                            <div class="verified-badge with-tip margin-bottom-30" data-tip-content="Purchase ticket has been verified and belongs business owner or manager."> <i class="sl sl-icon-check"></i> Now Available</div>
                            <div class="utf_box_widget booking_widget_box">
                                <h3><i class="fa fa-calendar"></i> Check Room Availability</h3>
                                <div class="row with-forms margin-top-0">
                                    <div class="col-lg-12 col-md-12 select_date_box">
                                        <label for="">Name of Hotel</label>
                                        <input type="text" id="name-hotel" value={detailHotel.name} name="name-hotel"/>
                                    </div>
                                    <div class="col-lg-12 col-md-12 select_date_box">
                                        <label for="">Check-in Date</label>
                                        <input type="date" id="date-picker" value={checkin} name="checkin" placeholder="Select Date" onChange={handleCheckinDate}/>
                                    </div>
                                    <div class="col-lg-12 col-md-12 select_date_box">
                                        <label for="">Check-out Date</label>
                                        <input type="date" id="date-picker" value={checkout} name="checkout" placeholder="Select Date" onChange={handleCheckoutDate}/>
                                    </div>
                                    <div class="with-forms">
                                        <div class="col-lg-12 col-md-12 ">
                                            <label for="">Room Type </label>
                                            <select name="room-type" class="utf_chosen_select_single" required
                                                    onChange={handleSelectRoomType}>
                                                <option value="">Select Room Type</option>
                                                {roomTypes.map(roomType => (
                                                    <option value={roomType.type}>{roomType.type}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="with-forms">
                                        <div class="col-lg-12 col-md-12">
                                        <a href="#">Guests <span class="qtyTotal" name="qtyTotal">{adults + childrens}</span></a>
                                        <div class="panel-dropdown-content">
                                            <div class="qtyButtons">
                                                <div class="qtyTitle">Adults</div>
                                                <button className="btn-decrement" style={{width:'40px', border:'none' }}
                                                onClick={() => changeQuantity('adults', -1)}>-</button>
                                                <input type="text" name="adult" value={adults}/>
                                                <button className="btn-increment" style={{width:'40px', border:'none' }}
                                                onClick={() => changeQuantity('adults', 1)}>+</button>
                                            </div>
                                            <div class="qtyButtons">
                                                <div class="qtyTitle">Childrens</div>
                                                <button className="btn-decrement" style={{width:'40px', border:'none' }}
                                                onClick={() => changeQuantity('childrens', -1)}>-</button>
                                                <input type="text" name="children" value={childrens}/>
                                                <button className="btn-increment" style={{width:'40px', border:'none' }}
                                                onClick={() => changeQuantity('childrens', 1)}>+</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                    
                                </div>
                                <a href="#" class="utf_progress_button button fullwidth_block margin-top-5" onClick={handleCheckRoomAvailability}>Check</a>
                                <div class="clearfix"></div>
                            </div>
                            <div class="utf_box_widget margin-top-35">
                                <h3><i class="sl sl-icon-phone"></i> Contact Info</h3>
                                <div class="utf_hosted_by_user_title"> <a href="#" class="utf_hosted_by_avatar_listing"><img src={inforReceptionist?.profile?.image} alt=""/></a>
                                    <h4><a href="#">{inforReceptionist?.user?.full_name}</a><span>Receptionist</span>
                                        <span><i class="sl sl-icon-location"></i>{inforReceptionist?.profile?.city}, {inforReceptionist?.profile?.country}</span>
                                    </h4>
                                </div>
                                <ul class="utf_social_icon rounded margin-top-10">
                                    <li><a class="facebook"  href={inforReceptionist?.profile?.facebook}><i class="icon-facebook"></i></a></li>
                                    <li><a class="twitter" href="#"><i class="icon-twitter"></i></a></li>
                                    <li><a class="gplus" href="#"><i class="icon-gplus"></i></a></li>
                                    <li><a class="linkedin" href="#"><i class="icon-linkedin"></i></a></li>
                                    <li><a class="instagram" href="#"><i class="icon-instagram"></i></a></li>
                                </ul>
                                <ul class="utf_listing_detail_sidebar">
                                    <li><i class="sl sl-icon-map"></i> {detailHotel.address}</li>
                                    <li><i class="sl sl-icon-phone"></i>{inforReceptionist?.user?.phone}</li>
                                    <li><i class="fa fa-envelope-o"></i> <a href={`mailto:${inforReceptionist?.user?.email}`}>{inforReceptionist?.user?.email}</a></li>
                                </ul>
                            </div>

                            <div class="utf_box_widget opening-hours margin-top-35">
                                <h3><i class="sl sl-icon-clock"></i> Timing</h3>
                                <ul>
                                    <li>Monday <span>09:00 AM - 10:00 PM</span></li>
                                    <li>Tuesday <span>09:00 AM - 10:00 PM</span></li>
                                    <li>Wednesday <span>09:00 AM - 10:00 PM</span></li>
                                    <li>Thursday <span>09:00 AM - 10:00 PM</span></li>
                                    <li>Friday <span>09:00 AM - 10:00 PM</span></li>
                                    <li>Saturday <span>09:00 AM - 10:00 PM</span></li>
                                    <li>Sunday <span>09:00 AM - 10:00 PM</span></li>
                                </ul>
                            </div>
                            <div class="opening-hours margin-top-35">
                                <div class="utf_coupon_widget" style={{ backgroundImage: 'url(images/coupon-bg-1.jpg)' }}>
                                    <div class="utf_coupon_overlay"></div>
                                    <a href="#" class="utf_coupon_top">
                                        <h3>Book Now & Get {publicCoupon[0]?.discount}% Discount</h3>
                                        <div class="utf_coupon_expires_date">Date of Expires {publicCoupon[0]?.valid_to}</div>
                                        <div class="utf_coupon_used"><strong>How to use?</strong> Just apply this coupon on a Check-out page.</div>
                                    </a>
                                    <div class="utf_coupon_bottom">
                                        <p>Coupon Code</p>
                                        <div className="utf_coupon_code">
                                            {publicCoupon[0]?.code ? publicCoupon[0].code : "No public coupons available."}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="utf_box_widget margin-top-35">
                                <h3><i class="sl sl-icon-phone"></i> Quick Contact to Help?</h3>
                                <p>Excepteur sint occaecat non proident, sunt in culpa officia deserunt mollit anim id est laborum.</p>
                                <ul class="utf_social_icon rounded">
                                    <li><a class="facebook" href="#"><i class="icon-facebook"></i></a></li>
                                    <li><a class="twitter" href="#"><i class="icon-twitter"></i></a></li>
                                    <li><a class="gplus" href="#"><i class="icon-gplus"></i></a></li>
                                    <li><a class="linkedin" href="#"><i class="icon-linkedin"></i></a></li>
                                    <li><a class="instagram" href="#"><i class="icon-instagram"></i></a></li>
                                </ul>
                                <a class="utf_progress_button button fullwidth_block margin-top-5" href="contact.html">Contact Us</a>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div id="bottom_backto_top"><a href="#"></a></div>
            </div>
        </>
    )
}

const modalStyles = {
    display: 'flex',
    position: 'fixed',
    zIndex: 1000, // Đảm bảo modal ở trên cùng
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
};

const modalContentStyles = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    textAlign: 'center',
    width: '80%',  
    maxWidth: '600px', 
    height: 'auto', 
};

const closeButtonStyles = {
    cursor: 'pointer',
    float: 'right',
    fontSize: '28px',
    fontWeight: 'bold',
};

const imageStyles = {
    maxWidth: '100%',
    height: 'auto',
};

const styles = `
    .blurred {
        filter: blur(5px);
        pointer-events: none; /* Ngăn chặn tương tác với các phần tử mờ */
    }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default DetailHotel