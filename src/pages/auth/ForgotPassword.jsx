import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const baseURL = API_BASE_URL;
    const token = localStorage.getItem('accessToken');

    const handleRegisterClick = () => {
        navigate('/register'); 
    };

    const forgotPassword = async() => {
        const URL = `${API_BASE_URL}/user/api/userauths/auth/reset-password/`
            const data = {
                email: email
            }
            try {
                const reponse = await axios.post(URL, data);
                console.log(reponse.data);
                Swal.fire({
                            icon: 'success',
                            title: 'Thành công!',
                            text: 'Vui lòng kiểm tra email của bạn.',
                            showConfirmButton: false,
                            timer: 2000
                        })
            }
            catch (error) {
                console.log(error);
            }
    }

    const handleForgotPassword = (e) => {
        e.preventDefault();
        Swal.fire({
            icon: 'question',
            title: 'Xác nhận!',
            text: ' Kiểm tra email đã điền chính xác !',
            showCancelButton: true,
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if(result.isConfirmed) {
                forgotPassword()
            }
            else {
                console.log("Reset password cancelled.");
            }
        })
    };

    return (
        <>
            <div id="main_wrapper">
                <header id="header_part" className="fullwidth">
                    <div id="header">
                        <div className="container">
                            <div className="utf_left_side">
                                <div id="logo"> <a href="/"><img src="images/logo-booking-hotel.png" alt=""/></a> </div>
                                <div className="mmenu-trigger">
                                    <button className="hamburger utfbutton_collapse" type="button">
                                        <span className="utf_inner_button_box">
                                            <span className="utf_inner_section"></span>
                                        </span>
                                    </button>
                                </div>
                                    <nav id="navigation" className="style_one">
                                    </nav>
                                <div className="clearfix"></div>
                            </div>
                            <div className="utf_right_side">
                                <div className="header_widget"> <a href="#dialog_signin_part" className="button border sign-in popup-with-zoom-anim" onClick={handleRegisterClick}><i className="fa fa-plus"></i> Register</a> <a href="/login" className="button border with-icon"><i className="sl sl-icon-login"></i> Login</a></div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="clearfix"></div>

                <div className="fullwidth_block search_categorie_block">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <h3 className="headline_part centered margin-top-75 margin-bottom-45">Forgot Password <span>Enter your Email to authenticate via Email.</span> </h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    <div className="category_container_item_part card">
                                        <div className="utf_signin_form style_one">
                                            <ul className="utf_tabs_nav">
                                            </ul>
                                            <div className="tab_container alt">
                                            <div className="tab_content" id="tab1" style={{ display: 'block' }}>
                                                <form method="post" className="forgotpassword" onSubmit={handleForgotPassword}>
                                                    <p className="utf_row_form utf_form_wide_block">
                                                        <label htmlFor="username">
                                                            <input type="text" className="input-text" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Type your Email..." />
                                                        </label>
                                                    </p>
                                                    <div className="utf_row_form">
                                                        <input type="submit" className="button border margin-top-5" name="login" value="Send confirmation to gmail" />
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    <div className="category_container_item_part">
                                        <a href="/" className="category_item_box"> 
                                            <img src="images/logo-booking-hotel.png" style={{width: '100%', height: '420px'}} alt=""/>
                                            <div className="category_content_box_part">
                                                <h3>Move to Home</h3>
                                                <span>To enjoy more features</span> 
                                            </div>
                                        </a>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="clearfix"></div>
              
            </div>
        </>
    ) 
}
export default ForgotPassword


