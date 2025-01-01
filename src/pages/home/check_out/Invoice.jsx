import { useEffect, useState } from "react";
import { apiRequest } from "../../../utils/api";
import API_BASE_URL from '../../../config/apiConfig';
import { useLocation } from 'react-router-dom';

const Invoice = () => {

    const [dataInforBooking, setDataInforBooking] = useState({});

    const query = new URLSearchParams(useLocation().search);
    const bookingID = query.get('booking-id');
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    url.search = '';
    const logoImageUrl = `${url.origin}/images/logo-booking-hotel.png`;

    useEffect(() => {
        console.log('Booking ID', bookingID);
        fetchdetailBooking();
    }, [])

    const fetchdetailBooking = async() => {
        const URL = `${API_BASE_URL}/api/bookings/get-detail-booking/${bookingID}/`;
        try {
            const response = await apiRequest(URL);
            console.log(response.data);
            setDataInforBooking(response.data);
        }
        catch (error) {
            console.error(error)
        }
    }

    const formatDateToGMT7 = (dateString) => {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Ho_Chi_Minh', 
            hour12: false
        };
        return date.toLocaleString('sv-SE', options).replace(' ', ' '); // Định dạng yyyy-mm-dd hh:mm:ss
    };

    return (
        <>
            <div class="container mt-6 mb-7">
                <div class="row justify-content-center a4-paper">
                    <div class="col-lg-12 col-xl-7">
                        <div class="card">
                        <div class="card-body p-5">
                            <div class="row">
                                <div class="col-md-6">
                                    {/* <a href="javascript:window.print()" class="btn btn-success me-1"><i class="fa fa-print"></i> Print</a> */}
                                    <a href="#!" class="btn btn-dark btn-lg card-footer-btn justify-content-center text-uppercase-bold-sm hover-lift-light">
                                        <span class="svg-icon text-white me-2">
                                            <title>ionicons-v5-g</title>
                                            <path 
                                                d="M336,208V113a80,80,0,0,0-160,0v95" 
                                                style={{
                                                    fill: 'none',
                                                    stroke: '#000',
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round',
                                                    strokeWidth: '32px'
                                                }}
                                            />
                                            <rect 
                                                x="96" 
                                                y="208" 
                                                width="320" 
                                                height="272" 
                                                rx="48" 
                                                ry="48" 
                                                style={{
                                                    fill: 'none',
                                                    stroke: '#000',
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round',
                                                    strokeWidth: '32px'
                                                }}
                                            />
                                        
                                        </span>
                                        #Paid
                                    </a>
                                    <h2 style={{ paddingTop: '40px' }}>
                                        Hey {dataInforBooking.orderer_information?.username_order || "User"},
                                    </h2>
                                </div>
                                <div className="col-md-6 text-md-end">
                                    <div className="invoice-logo">
                                        <img width="100" src={logoImageUrl} alt="Invoice logo" />
                                    </div>
                                    <style jsx>{`
                                        .invoice-logo {
                                            display: flex;
                                            justify-content: flex-end; /* Căn giữa theo chiều ngang */
                                            padding-bottom: 30px;
                                        }
                                        img {
                                            margin-right: 0; /* Nếu cần khoảng cách bên phải */
                                        }
                                    `}</style>
                                </div>
                                
                            </div>
                            <div class="border-top border-gray-200 pt-4 mt-4">
                                <div class="row">
                                    <div class="col-md-6">
                                    <div class="text-muted mb-2">Booking ID</div>
                                    <strong>#{bookingID}</strong>
                                    </div>
                                    <div class="col-md-6 text-md-end">
                                    <div class="text-muted mb-2">Booking Date</div>
                                    <strong>{formatDateToGMT7(dataInforBooking.date)}</strong>
                                    </div>
                                </div>
                            </div>

                            <div class="border-top border-gray-200 mt-4 py-4">
                                <div class="row">
                                    <div class="col-md-6">
                                    <div class="text-muted mb-2">Client</div>
                                    <strong>
                                        {dataInforBooking.orderer_information?.full_name_order}
                                    </strong>
                                    <p class="fs-sm">
                                        {dataInforBooking.orderer_information?.address_order}, {dataInforBooking.orderer_information?.city_order}, {dataInforBooking.orderer_information?.country_order}
                                        <br/>
                                        <a href="#!" class="text-purple">{dataInforBooking.orderer_information?.email_order}
                                        </a>
                                    </p>
                                    </div>
                                    <div class="col-md-6 text-md-end">
                                    <div class="text-muted mb-2">Payment To</div>
                                    <strong>
                                        {dataInforBooking.hotel_name}
                                    </strong>
                                    <p class="fs-sm">
                                        {dataInforBooking.address_hotel}
                                        <br/>
                                        <a href="#!" class="text-purple">{dataInforBooking.email_hotel}
                                        </a>
                                    </p>
                                    </div>
                                </div>
                            </div>
                            <div class="border-top border-gray-200 mt-4 py-4">
                                <div class="row">
                                    <div class="col-md-6">
                                    <div class="text-muted mb-2">Accommodation Information</div>
                                    <strong>
                                        {dataInforBooking.accommodation_information?.full_name_accommodation}
                                    </strong>
                                    <p class="fs-sm">
                                        {dataInforBooking.accommodation_information?.phone_accommodation}
                                        <br/>
                                        <a href="#!" class="text-purple">{dataInforBooking.accommodation_information?.email_accommodation}
                                        </a>
                                    </p>
                                    </div>
                                    <div class="col-md-6 text-md-end">
                                    <div class="text-muted mb-2">Room Information</div>
                                    <strong>
                                        Hotel: {dataInforBooking.hotel_name} - Room Type: {dataInforBooking.room_type}
                                    </strong>
                                    <p class="fs-sm">
                                        Checkin date: {dataInforBooking.check_in_date}
                                        <br/>
                                        Checkout date: {dataInforBooking.check_out_date}
                                        <br/>
                                        Num of Adults: {dataInforBooking.num_adults}
                                        <br/>
                                        Num of Childrens: {dataInforBooking.num_children}
                                        <br/>
                                    </p>
                                    </div>
                                </div>
                            </div>

                            <table class="table border-bottom border-gray-200 mt-3">
                            <thead>
                                <tr>
                                <th scope="col" class="fs-sm text-dark text-uppercase-bold-sm px-0">Description</th>
                                <th scope="col" class="fs-sm text-dark text-uppercase-bold-sm text-end px-0">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td class="px-0">{dataInforBooking.hotel_name} - {dataInforBooking.room_type} x {dataInforBooking.total_days} days</td>
                                <td class="text-end px-0">${dataInforBooking.before_discount}</td>
                                </tr>
                            </tbody>
                            </table>
                            <div class="mt-5" style={{ textAlign: 'right' }}>
                                <div class="d-flex justify-content-end">
                                    <p class="text-muted me-3">Subtotal: <span style={{ marginLeft: '10px' }}>${dataInforBooking.before_discount} USD</span></p>
                                    {/* <span>${dataInforBooking.before_discount} USD</span> */}
                                </div>
                                <div class="d-flex justify-content-end">
                                    <p class="text-muted me-3">Discount: <span style={{ marginLeft: '10px' }}>-${dataInforBooking.discount} USD</span></p>
                                    {/* <span>-${dataInforBooking.discount} USD</span> */}
                                </div>
                                <div class="d-flex justify-content-end mt-3">
                                    <h5 class="me-3" style={{ fontWeight: 'bold', fontSize: '25px' }}>
                                        Total: 
                                         <span class="text-success" style={{ fontWeight: 'bold', fontSize: '25px', marginLeft: '15px' }}>
                                            ${dataInforBooking.total_bookings} USD
                                        </span>
                                    </h5>
                                </div>
                            </div>
                        </div>
                        {/* <a href="#!" class="btn btn-dark btn-lg card-footer-btn justify-content-center text-uppercase-bold-sm hover-lift-light">
                            <span class="svg-icon text-white me-2">
                            
                                <title>ionicons-v5-g</title>
                                <path 
                                    d="M336,208V113a80,80,0,0,0-160,0v95" 
                                    style={{
                                        fill: 'none',
                                        stroke: '#000',
                                        strokeLinecap: 'round',
                                        strokeLinejoin: 'round',
                                        strokeWidth: '32px'
                                    }}
                                />
                                <rect 
                                    x="96" 
                                    y="208" 
                                    width="320" 
                                    height="272" 
                                    rx="48" 
                                    ry="48" 
                                    style={{
                                        fill: 'none',
                                        stroke: '#000',
                                        strokeLinecap: 'round',
                                        strokeLinejoin: 'round',
                                        strokeWidth: '32px'
                                    }}
                                />
                            
                            </span>
                            Paid
                        </a> */}
                        <a href="javascript:window.print()" class="btn btn-success me-1"><i class="fa fa-print"></i> Print</a>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Invoice;