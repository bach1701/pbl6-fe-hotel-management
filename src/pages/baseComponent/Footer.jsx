import { Link } from "react-router-dom"

const Footer = () => {

    return (
        <div id="footer" class="footer_sticky_part">
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
                            <li><Link to='/user-profile/my-profile'>Hồ sơ của tôi</Link></li>
                            <li><Link to='/selected-room'>Danh phòng chờ của tôi</Link></li>
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
                        <li><Link to='/login'>Đăng nhập</Link></li>
                        <li><Link to='/register'>Đăng ký</Link></li>
                        <li><Link to='/'>Liên hệ</Link></li>
                        </ul>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="footer_copyright_part">Copyright © 2022 All Rights Reserved.</div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Footer