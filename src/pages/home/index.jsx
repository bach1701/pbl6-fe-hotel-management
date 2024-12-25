import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRoomCount } from './RoomCountContext/RoomCountContext';
import API_BASE_URL from '../../config/apiConfig';
import { Link } from 'react-router-dom';
import { apiRequest } from "../../utils/api";
import Swal from 'sweetalert2';



const Index = ()=>{
    const navigate = useNavigate();

    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hotelName, setHotelName] = useState('');
    const { setRoomCount } = useRoomCount();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const token = localStorage.getItem('accessToken');
    const baseURL = API_BASE_URL;

    const handleSearch = () => {
        if(hotelName != '')
            navigate(`/listhotel?name=${encodeURIComponent(hotelName)}`); 
        else navigate(`/listhotel`);
    };

    const calculateAverageRating = (reviews) => {
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (totalRating / reviews.length).toFixed(1); 
    };

    const handleSendContactEmail = async () => {
        const data = {
            email: email,
            message: message
        }
        const URL = `${baseURL}/user/api/userauths/contact-email/`;
        try {
            const response = await apiRequest(URL, 'POST', data);
            console.log(response.data);
            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Vui lòng chờ phản hồi qua email của bạn.',
                showConfirmButton: false,
                timer: 2000
            })
            setEmail('');
            setMessage('');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Vui lòng kiểm tra lại email hoặc message.',
                showConfirmButton: false,
                timer: 2000
            })
            console.log(error.message);
        }  
    }

    useEffect(() => {
        const fetchHotels = async () => {
            console.log('baseURL: ' + baseURL);
            try {
                const response = await axios.get(`${baseURL}/api/hotels/`);
                console.log(response.data);
                // setHotels(response.data);
                const hotelsWithRatings = response.data.map(hotel => ({
                    ...hotel,
                    averageRating: calculateAverageRating(hotel.reviews)
                }));
                setHotels(hotelsWithRatings);
                console.log(hotelsWithRatings);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

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
        if (token) {
            console.log('access token:', token);
            fetchCartItemCount();
        }
        fetchHotels();
      }, []);
    
      if (loading) return <p>Loading hotels...</p>;
      if (error) return <p>Error: {error}</p>;
      
    return (
        <div id="main_wrapper">
            {/* <Header /> */}
            <div class="clearfix"></div>

            {/* Banner */}
            <div class="search_container_block main_search_block" data-background-image="images/home_section_1.jpg" style={{ backgroundImage: 'url("images/home_section_1.jpg")' }}>
                <div class="main_inner_search_block">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-12">
                                <h2>Book Unique Experiences</h2>
                                <h4>Discover top rated hotels, shops and restaurants around the world</h4>
                                <div class="main_input_search_part">
                                    <div class="main_input_search_part_item">
                                        <input type="text" placeholder="Type name of hotel..." 
                                        value={hotelName} onChange={(e)=>setHotelName(e.target.value)} 
                                        />
                                    </div>
                                    <div class="main_input_search_part_item main-search-input-item search-input-icon">
                                        <input type="text" placeholder="Select Booking Date" id="booking-date-search"/>
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                    <div class="main_input_search_part_item intro-search-field">
                                        <select data-placeholder="All Categories" class="selectpicker default" title="All Categories" data-live-search="true" data-selected-text-format="count" data-size="5">
                                <option>Food & Restaurants </option>
                                <option>Shop & Education</option>
                                <option>Education</option>
                                <option>Business</option>
                                <option>Events</option>
                                </select>
                                    </div>
                                    <button class="button" onclick="window.location.href='listings_half_screen_map_list.html'" onClick={handleSearch}>Search</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="fullwidth_block search_categorie_block">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <h3 class="headline_part centered margin-top-75 margin-bottom-45">Gợi ý địa điểm du lịch <span></span> </h3>
                        </div>
                    </div>
                </div>

                <div class="col-md-12">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-4 col-sm-6 col-xs-12">
                                <div class="category_container_item_part">
                                    <a target="_blank" href="https://vinpearl.com/vi/50-dia-diem-du-lich-da-nang-hap-dan-nhat-ban-tha-ho-lua-chon" class="category_item_box">
                                        <div class="featured-type featured">
                                            Top <br/>Featured
                                        </div>
                                        <img src="images/danang.jpg" alt="" />
                                        <span class="category_item_box_btn">Browse</span>
                                        <div class="category_content_box_part">
                                            <h3>TP Đà Nẵng</h3>
                                            <span>15 listings</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div class="col-md-4 col-sm-6 col-xs-12">
                                <div class="category_container_item_part">
                                    <a target="_blank" href="https://vinpearl.com/vi/du-lich-hue-tong-hop-cac-thong-tin-can-biet" class="category_item_box"> 
                                        <img src="images/hue.jpeg" alt=""/>
                                        <span class="category_item_box_btn">Browse</span>
                                        <div class="category_content_box_part">
                                            <h3>TP Huế</h3>
                                            <span>27 Listings</span> 
                                        </div>
                                    </a>
                                </div>
                            </div>

                            <div class="col-md-4 col-sm-6 col-xs-12">
                                <div class="category_container_item_part">
                                    <a target="_blank" href="https://vinpearl.com/vi/toplist-dia-diem-du-lich-sai-gon-nghe-la-muon-xach-balo-len-va-di" class="category_item_box"> 
                                    <img src="images/hcm.jpg" alt=""/>
                                    <span class="category_item_box_btn">Browse</span>
                                        <div class="category_content_box_part">
                                        <h3>TP Hồ Chí Minh</h3>
                                        <span>22 Listings</span> 
                                        </div>
                                    </a>
                                </div>
                            </div>

                            <div class="col-md-4 col-sm-6 col-xs-12">
                                <div class="category_container_item_part">
                                    <a target="_blank" href="https://vinpearl.com/vi/du-lich-ha-noi-voi-tron-bo-bi-kip-day-du-vui-quen-loi-ve" class="category_item_box"> 
                                    <img src="images/hanoi.png" alt=""/> 
                                    <span class="category_item_box_btn">Browse</span>
                                    <div class="category_content_box_part">
                                        <h3>Thủ đô Hà Nội</h3>
                                        <span>15 Listings</span> 
                                    </div>
                                    </a>
                                </div>
                            </div>
                            <div class="col-md-4 col-sm-6 col-xs-12">
                                <div class="category_container_item_part">
                                    <a target="_blank" href="https://vinpearl.com/vi/chia-se-tu-a-z-kinh-nghiem-du-lich-phu-quoc-cho-gia-dinh" class="category_item_box">
                                        <div class="featured-type featured">
                                            Top <br/>Rated City
                                        </div>
                                        <img src="images/phuquoc.jpg" alt="" />
                                        <span class="category_item_box_btn">Browse</span>
                                        <div class="category_content_box_part">
                                            <h3>Đảo Phú Quốc</h3>
                                            <span>26 Listings</span>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            <div class="col-md-4 col-sm-6 col-xs-12">
                                <div class="category_container_item_part">
                                    <a target="_blank" href="https://vinpearl.com/vi/kinh-nghiem-du-lich-hoi-an-tron-bo-thoi-gian-di-lai-an-o-vui-choi" class="category_item_box"> 
                                    <img src="images/hoian.jpg" alt=""/>
                                    <span class="category_item_box_btn">Browse</span>
                                    <div class="category_content_box_part">
                                        <h3>Phố cổ Hội An</h3>
                                        <span>27 Listings</span> 
                                    </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="clearfix"></div>

            <section class="fullwidth_block margin-top-65 padding-top-75 padding-bottom-70" data-background-color="#f9f9f9">
                <div class="container">
                    <div class="row slick_carousel_slider">
                        <div class="col-md-12">
                            <h3 class="headline_part centered margin-bottom-45">Khách sạn nổi bật <span>Khám phá những địa điểm tuyệt vời cùng Travel-PBL6!</span> </h3>
                        </div>
                        <div class="row">     
                            <div class="col-md-12">
                                <div class="simple_slick_carousel_block utf_dots_nav">
                                    <ul className="hotels-list">
                                        {hotels.map(hotel=>(
                                            <li>
                                                <div class="utf_carousel_item">
                                                    <Link to={`/detailhotel/${hotel.slug}`} class="utf_listing_item-container compact">
                                                        <div class="utf_listing_item"> <img src={hotel.map_image} alt=""/>
                                                            <span class="utf_open_now">Open Now</span>
                                                            <div class="utf_listing_item_content">
                                                                <div class="utf_listing_prige_block">
                                                                    <span class="utf_meta_listing_price"><i class="fa fa-tag"></i> $25 - $55</span>
                                                                    <span class="utp_approve_item"><i class="utf_approve_listing"></i></span>
                                                                </div>
                                                                <h3>{hotel.name}</h3>
                                                                <span><i class="fa fa-map-marker"></i>{hotel.address}</span>
                                                                <span><i class="fa fa-phone"></i>{hotel.mobile}</span>
                                                            </div>
                                                        </div>
                                                        <div class="utf_star_rating_section" data-rating="4.5">
                                                            <div class="utf_counter_star_rating">({hotel.averageRating})</div>
                                                            {/* <span class="utf_view_count"><i class="fa fa-eye"></i>{hotel.views}</span> */}
                                                            <span class="like-icon"></span>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="fullwidth_block padding-top-75 padding-bottom-75" data-background-color="#ffffff">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <h3 class="headline_part centered margin-bottom-50">Tips & Blog</h3>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-3 col-sm-6 col-xs-12">
                            <a target="_blank" href="https://www.bestprice.vn/blog/kinh-nghiem-du-lich-5/7-meo-vang-can-thiet-cho-nguoi-di-du-lich-theo-tour_6-1367.html?srsltid=AfmBOoqifjcsualkqagj1EioOmicm8JhJwb3YgNxM3NP7Oa-GSDx_WQ5" class="blog_compact_part-container">
                                <div class="blog_compact_part"> <img src="images/blog-compact-post-01.jpg" alt=""/>
                                    <div class="blog_compact_part_content">
                                        <h3>7 Mẹo vàng</h3>
                                        <ul class="blog_post_tag_part">
                                            <li>22 January 2022</li>
                                        </ul>
                                        <p></p>
                                    </div>
                                </div>
                            </a>
                        </div>

                        <div class="col-md-3 col-sm-6 col-xs-12">
                            <a target="_blank" href="https://www.vietravel.com/vn/tin-tuc-du-lich/huong-dan-dat-tour-du-lich-vietravel-voi-6-buoc-don-gian-v14344.aspx" class="blog_compact_part-container">
                                <div class="blog_compact_part"> <img src="images/blog-compact-post-02.jpg" alt=""/>
                                    <div class="blog_compact_part_content">
                                        <h3>Hướng dẫn đặt tour du lịch Vietravel</h3>
                                        <ul class="blog_post_tag_part">
                                            <li>18 January 2022</li>
                                        </ul>
                                    </div>
                                </div>
                            </a>
                        </div>

                        <div class="col-md-3 col-sm-6 col-xs-12">
                            <a target="_blank" href="https://vnexpress.net/meo-du-lich-chau-au-mua-he-4754109.html" class="blog_compact_part-container">
                                <div class="blog_compact_part"> <img src="images/blog-compact-post-03.jpg" alt=""/>
                                    <div class="blog_compact_part_content">
                                        <h3>Mẹo du lịch châu Âu mùa hè</h3>
                                        <ul class="blog_post_tag_part">
                                            <li>10 January 2022</li>
                                        </ul>
                                    </div>
                                </div>
                            </a>
                        </div>

                        <div class="col-md-3 col-sm-6 col-xs-12">
                            <a target="_blank" href="https://sigo.vn/tour-du-lich-1-nguoi" class="blog_compact_part-container">
                                <div class="blog_compact_part"> <img src="images/blog-compact-post-04.jpg" alt=""/>
                                    <div class="blog_compact_part_content">
                                        <h3>Kinh nghiệm du lịch một người</h3>
                                        <ul class="blog_post_tag_part">
                                            <li>18 January 2022</li>
                                        </ul>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section class="utf_cta_area_item utf_cta_area2_block">
                <div class="container">
                    <div class="row">
                        <div class="col-md-8 col-md-offset-2">
                            <h2 class="headline_part centered margin-top-80">Contact<span class="margin-top-10">Our Contacts and Socials</span> </h2>
                        </div>
                        <div class="col-md-12">
                            <div class="utf_subscribe_block clearfix">
                                <div class="col-md-6 col-sm-7">
                                    <div class="section-heading">
                                        <h2 class="utf_sec_title_item utf_sec_title_item2">THÔNG TIN LIÊN HỆ</h2>
                                        <p class="utf_sec_meta"><i className='fa fa-location-pin' style={{paddingRight: "10px"}}></i>
                                        54 Nguyễn Lương Bằng, Đà Nẵng
                                        </p>
                                        <p class="utf_sec_meta"><i className='fa fa-envelope' style={{paddingRight: "10px"}}></i>
                                        travel-pbl6.dut.udn@gmail.com
                                        </p>
                                        <p class="utf_sec_meta"><i className='fa fa-phone' style={{paddingRight: "10px"}}></i>
                                        (+84) 344.543.345
                                        </p>
                                    </div>
                                </div>
                                <div class="col-md-6 col-sm-5">
                                    <div class="contact-form-action">
                                        <form method="post" onSubmit={(e) => { e.preventDefault(); handleSendContactEmail(); }}>
                                            <span class="la la-envelope-o"></span>
                                            <input class="form-control" type="email" placeholder="Nhập email của bạn" required="" value={email} onChange={(e) => setEmail(e.target.value)}/>
                                            <button class="utf_theme_btn" type="submit" onClick={handleSendContactEmail}>Gửi</button>
                                            <textarea name="comments" cols="40" rows="2" id="comments" placeholder="Your Message" required="" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="about-us" className="utf_testimonial_part fullwidth_block padding-top-75 padding-bottom-75">
                <div class="container">
                    <div class="row">
                        <div class="col-md-8 col-md-offset-2">
                            <h3 class="headline_part centered"> About Us <span className="margin-top-15">Our development team</span> </h3>
                        </div>
                    </div>
                </div>
                <div class="fullwidth_carousel_container_block margin-top-20">
                    <div class="utf_testimonial_carousel testimonials">
                        <div class="utf_carousel_review_container d-flex">
                            <div class="utf_carousel_review_part">
                                <div class="utf_testimonial_author"> 
                                    <img src="images/buinhan.jpg" alt=""/>
                                    <h4>Bùi Nhẫn<span>Mobile Developer</span><span>nhantaygia182003@gmail.com </span></h4>
                                </div>
                            </div>
                            <div class="utf_carousel_review_part">
                            <div class="utf_testimonial_author"> 
                                    <img src="images/nhathoang.jpg" alt=""/>
                                    <h4>Nhật Hoàng<span>Mobile Developer</span><span>nhathoang261203@gmail.com </span></h4>
                                </div>
                            </div>
                            <div class="utf_carousel_review_part">
                                <div class="utf_testimonial_author"> 
                                    <img src="images/duybach.jpeg" alt=""/>
                                    <h4>Duy Bách<span>Web Developer</span><span>phamduybach.dut.udn@gmail.com </span></h4>
                                </div>
                            </div>
                            <div class="utf_carousel_review_part">
                                <div class="utf_testimonial_author"> 
                                    <img src="images/chihieu.jpg" alt=""/>
                                    <h4>Chí Hiếu<span>Web Developer</span><span>chauchihieu2003@gmail.com </span></h4>
                                </div>
                            </div>
                            <div class="utf_carousel_review_part">
                                <div class="utf_testimonial_author"> 
                                    <img src="images/anhnguyen.jpg" alt=""/>
                                    <h4>Anh Nguyên<span>Web Developer</span><span>nguyenanhnguyen2805@gmail.com</span> </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            {/* <div id="footer" class="footer_sticky_part">
                <div class="container">
                    <div class="row">
                        <div class="col-md-8 col-sm-12 col-xs-12">
                            <h4>Giới thiệu về Chúng Tôi</h4>
                            <p>
                            Chào mừng bạn đến với Travel-PBL6, nơi chúng tôi kết nối du khách với những trải nghiệm lưu trú tuyệt vời tại hàng trăm khách sạn trên toàn quốc. Với sứ mệnh mang đến sự thuận tiện và dễ dàng trong việc đặt phòng, chúng tôi tự hào cung cấp một nền tảng trực tuyến đơn giản và thân thiện với người dùng.
                            </p>
                            <h4>Lịch Sử Hình Thành</h4>
                            <p>
                            Travel-PBL6 được thành lập vào năm 2024 với mong muốn cách mạng hóa trải nghiệm đặt phòng khách sạn. Đội ngũ sáng lập của chúng tôi gồm những chuyên gia trong ngành du lịch, luôn nỗ lực để cải thiện và tối ưu hóa quy trình đặt phòng cho mọi khách hàng.
                            </p>
                            <h4>Liên Hệ với Chúng Tôi</h4>
                            <p>
                            Nếu bạn có bất kỳ câu hỏi nào hoặc cần hỗ trợ, hãy liên hệ với chúng tôi qua travel-pbl6.dut.udn@gmail.com!
                            </p>
                        </div>
                        <div class="col-md-2 col-sm-3 col-xs-6">
                            <h4>My Account</h4>
                            <ul class="social_footer_link">
                                <li><a href="#">Hồ sơ của tôi</a></li>
                                <li><a href="#">Giỏ hàng của tôi</a></li>
                            </ul>
                        </div>
                        <div class="col-md-2 col-sm-3 col-xs-6">
                            <h4>Pages</h4>
                            <ul class="social_footer_link">
                                <li><a href="#">Blog & Tip</a></li>
                                <li><a href="#">Gợi ý địa điểm du lịch</a></li>
                                <li><a href="#">Khách sạn nổi bật</a></li>
                            </ul>
                        </div>
                        <div class="col-md-2 col-sm-3 col-xs-6">
                            <h4>Help</h4>
                            <ul class="social_footer_link">
                                <li><a href="#">Đăng nhập</a></li>
                                <li><a href="#">Đăng kí</a></li>
                                <li><a href="#">Liên hệ</a></li>
                            </ul>
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
    )
}
export default Index