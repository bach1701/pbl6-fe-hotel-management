import { Link } from "react-router-dom"

const Footer = () => {

    return (
        <div id="footer" class="footer_sticky_part">
            <div class="container">
                <div class="row">
                    <div class="col-md-8 col-sm-12 col-xs-12">
                        <h4>About Us</h4>
                        <p>Welcome to Travel-PBL6, where we connect travelers with great stay experiences at hundreds of hotels nationwide. With a mission to provide convenience and ease in booking, we are proud to provide a simple and user-friendly online platform.</p>
                        <h4>History of Formation</h4>
                        <p>Travel-PBL6 was founded in 2024 with the desire to revolutionize the hotel booking experience. Our founding team is made up of experts in the travel industry, always working to improve and optimize the booking process for every customer. </p>
                        <h4>Contact Us</h4>
                        <p>
                        If you have any questions or need assistance, contact us at travel-pbl6.dut.udn@gmail.com!
                        </p>
                    </div>
                    <div class="col-md-2 col-sm-3 col-xs-6">
                        <h4>My Account</h4>
                        <ul class="social_footer_link">
                            <li><Link to='/user-profile/my-profile'>My Profile</Link></li>
                            <li><Link to='/selected-room'>List Cart Item</Link></li>
                        </ul>
                    </div>
                    <div class="col-md-2 col-sm-3 col-xs-6">
                        <h4>Pages</h4>
                        <ul class="social_footer_link">
                            <li><a href="#">Blog & Tip</a></li>
                            <li><a href="#">Reference Location</a></li>
                            <li><a href="#">Our Popular Hotels</a></li>
                        </ul>
                    </div>
                    <div class="col-md-2 col-sm-3 col-xs-6">
                        <h4>Help</h4>
                        <ul class="social_footer_link">
                        <li><Link to='/login'>Login</Link></li>
                        <li><Link to='/register'>Register</Link></li>
                        <li><Link to='/'>Contact</Link></li>
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