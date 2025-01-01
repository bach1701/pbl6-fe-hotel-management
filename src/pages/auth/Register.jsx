import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import API_BASE_URL from '../../config/apiConfig';

const Register = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [showRulesModal, setShowRulesModal] = useState(false);

    const handleDisplayRules = () => {
        setShowRulesModal(true); 
    };

    const handleCloseModal = () => {
        setShowRulesModal(false); 
    };

    const navigate = useNavigate();
    const baseURL = API_BASE_URL;

    const handleLoginClick = () => {
        navigate('/login'); 
    };
  
    const handleSignup = async (e) => {
        e.preventDefault();

        if (username.length < 5 || username.length > 18) {
            setMessage('*Username must be between 5 and 18 characters.');
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Username must be between 5 and 18 characters.',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage('*Email is not valid.');
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Email is not valid.',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if (password.length < 6 || password.length > 18) {
            setMessage('*Password must be between 6 and 18 characters.');
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Password must be between 6 and 18 characters.',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,18}$/;

        if (!passwordRegex.test(password)) {
            setMessage('*Password must contain at least one uppercase letter and one special character.');
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Password must contain at least one uppercase letter and one special character.',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Passwords do not match.',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        try {
            const response = await axios.post(
                `${baseURL}/user/api/userauths/register/`,
                {
                    email,
                    password,
                    username,
                }
            );

            if (response.status === 201) {
                setMessage('Register successful! Please log in to use our service!');
                console.log('Register successful:', response.data);
                localStorage.setItem('accessToken', response.data.access); 
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Successful account registration.',
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/');
            }
        } catch (error) {
            setMessage('Register failed');
            console.error('Register failed:', error.response.data);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Please check again.',
                showConfirmButton: false,
                timer: 1500
            });
        }
    };
        return (
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
                                <div className="clearfix"></div>
                            </div>
                            <div className="utf_right_side">
                                <div className="header_widget"> <a href="#dialog_signin_part" className="button border sign-in popup-with-zoom-anim" onClick={handleLoginClick}><i className="fa fa-sign-in"></i> Login</a> </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="clearfix"></div>

                <div className="fullwidth_block search_categorie_block">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <h3 className="headline_part centered margin-top-75 margin-bottom-45">Register <span>Hi there! Welcome to Travel-PBL6</span> </h3>
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
                                                <div className="tab_content" id="tab2" style={{display: 'block'}}>
                                                    <form method="post" className="register" onSubmit={handleSignup}>
                                                        <p className="utf_row_form utf_form_wide_block">
                                                            <label htmlFor="username2">
                                                                <input type="text" className="input-text" name="username" id="username2" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                                                            </label>
                                                        </p>
                                                        <p className="utf_row_form utf_form_wide_block">
                                                            <label htmlFor="email2">
                                                                <input type="text" className="input-text" name="email" id="email2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                                                            </label>
                                                        </p>
                                                        <p className="utf_row_form utf_form_wide_block">
                                                            <label htmlFor="password1">
                                                                <input className="input-text" type="password" name="password1" id="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                                                            </label>
                                                        </p>
                                                        <p className="utf_row_form utf_form_wide_block">
                                                            <label htmlFor="password2">
                                                                <input
                                                                className="input-text"
                                                                type="password"
                                                                name="password2"
                                                                id="password2"
                                                                value={confirmPassword} 
                                                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                                                placeholder="Confirm Password"
                                                                />
                                                            </label>
                                                        </p>
                                                        <p><i className="fa fa-info" style={{justifyContent: 'flex-end', display: 'flex', paddingRight: '10px', paddingTop: '0px', cursor: 'pointer'}} onClick = {handleDisplayRules}></i></p>
                                                        <input type="submit" className="button border fw margin-top-10" name="register" value="Register" />
                                                    </form>
                                                    {message && <p style={{color: "red"}}>{message}</p>} 
                                                    {showRulesModal && (
                                                        <div className="modal" style={modalStyles} onClick={handleCloseModal}>
                                                            <div className="modal-content" style={modalContentStyles} onClick={(e) => e.stopPropagation()}>
                                                                <span className="close" onClick={handleCloseModal} style={closeButtonStyles}>&times;</span>
                                                                <h2 style={{textAlign: 'center', marginBottom: '20px'}}>Account Creation Rules</h2>
                                                                <ul>
                                                                    <li>*Username must be between 5 and 18 characters long.</li>
                                                                    <li>*Email must be in a valid format.</li>
                                                                    <li>*Password must be between 6 and 18 characters long.</li>
                                                                    <li>*Password must contain at least one uppercase letter and one special character.</li>
                                                                    <li>*Password and Confirm Password must match.</li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    <div className="category_container_item_part">
                                        <a href="#" className="category_item_box"> 
                                            <img src="images/category-box-02.jpg" style={{width: '100%', height: '420px'}} alt=""/>
                                            <div className="category_content_box_part">
                                                <h3>Sign In Now</h3>
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
        )
}
export default Register

const modalStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
};

const modalContentStyles = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '4px',
    width: '80%',
    maxWidth: '600px',
    position: 'relative',
};

const closeButtonStyles = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    cursor: 'pointer',
    fontSize: '20px',
};