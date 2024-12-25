import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/home'
import Login from './pages/auth/Login.jsx'
import './styles/index.css';
import Register from "./pages/auth/Register";
import ListHotel from "./pages/home/list_hotel/ListHotel";
import DetailHotel from "./pages/home/detail_hotel/DetailHotel";
import CheckRoomAvailability from "./pages/home/check_room_availability/CheckRoomAvailability";
import CheckoutCartItem from "./pages/home/check_out/CheckOutCartItem";
import SelectedRoom from "./pages/home/selected_rooms/SelectedRoom";
import { RoomCountProvider } from './pages/home/RoomCountContext/RoomCountContext';
import Header from './pages/baseComponent/Header';
import SuccessPayment from "./pages/home/check_out/SuccessPayment";
import HistoryBooking from "./pages/user_profile/HistoryBooking";
import HistoryReview from "./pages/user_profile/HistoryReview";
import ChangePassword from "./pages/user_profile/ChangePassword";
import ProfilePage from "./pages/user_profile/ProfilePage";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Invoice from "./pages/home/check_out/Invoice"
import Footer from "./pages/baseComponent/Footer";
import { useLocation } from "react-router-dom";
import MainLayout from "./pages/baseComponent/MainLayout";
import LayoutNonFooter from "./pages/baseComponent/LayoutNonFooter";

export default function App() {
  return (
    <RoomCountProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
                    <Route path="login" element={<Login />} />
                    <Route path="forgot-password/" element={<ForgotPassword />} />
                    <Route path="reset-password/:id/:token" element={<ResetPassword />} />
                    <Route path="selected-room" element={<LayoutNonFooter><SelectedRoom /></LayoutNonFooter>} />
                    <Route path="user-profile/my-profile" element={<LayoutNonFooter><ProfilePage /></LayoutNonFooter>} />
                    <Route path="user-profile/history-booking" element={<LayoutNonFooter><HistoryBooking /></LayoutNonFooter>} />
                    <Route path="user-profile/history-review" element={<LayoutNonFooter><HistoryReview /></LayoutNonFooter>} />
                    <Route path="user-profile/change-password" element={<LayoutNonFooter><ChangePassword /></LayoutNonFooter>} />
                    <Route path="success-payment" element={<MainLayout><SuccessPayment /></MainLayout>} />
                    <Route path="invoice" element={<Invoice />} /> 
                    <Route path="checkout-cart-item" element={<LayoutNonFooter><CheckoutCartItem /></LayoutNonFooter>} />
                    <Route path="register" element={<Register />} />
                    <Route path="listhotel" element={<MainLayout><ListHotel /></MainLayout>} />
                    <Route path="detailhotel/:slug" element={<MainLayout><DetailHotel /></MainLayout>} />
                    <Route path="checkroomavailability/:slug" element={<LayoutNonFooter><CheckRoomAvailability /></LayoutNonFooter>} />
                    <Route path="contact" element={<div>Contact</div>} />
                    <Route path="*" element={<div>404 Not Found</div>} /> 

            {/* <Route element={<Header />} path="/*" /> */}
            {/* <Route index element={<MainLayout><Home /></MainLayout>} />
            <Route path="login" element={<Login />} />
            <Route path="forgot-password/" element={<ForgotPassword />} />
            <Route path="reset-password/:id/:token" element={<ResetPassword />} />
            <Route path="selected_room" element={<SelectedRoom />} />
            <Route path="user-profile/my-profile" element={<ProfilePage />} />
            <Route path="user-profile/history-booking" element={<HistoryBooking/>} />
            <Route path="user-profile/history-review" element={<HistoryReview/>} />
            <Route path="user-profile/change-password" element={<ChangePassword />} />
            <Route path="success-payment" element={<SuccessPayment />} />
            <Route path="invoice" element={<Invoice />} />
            <Route path="checkout-cart-item" element={<CheckoutCartItem />} />
            <Route path="register" element={<Register />} />
            <Route path="listhotel" element={<ListHotel />} />
            <Route path="detailhotel/:slug" element={<DetailHotel />} />
            <Route path="checkroomavailability/:slug" element={<CheckRoomAvailability />} />
            <Route path="contact" element={<div>Contact</div>} />
            <Route path="*" element={<div>1</div>} /> */}
        </Routes>
      </BrowserRouter>
    </RoomCountProvider>
  );
}

