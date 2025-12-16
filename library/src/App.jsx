import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import VerifyOtp from "./components/Verifyotp";
import ResetPassword from "./components/ResetPassword";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AddBook from "./components/AddBook";
import UpdateBook from "./components/UpdateBook";
import DeleteBook from "./components/DeleteBook";
import BookDetail from "./components/BookDetail";
import RegisteredUsers from "./components/RegisteredUsers";
import BorrowedTable from "./components/BorrowedTable";
import MembershipPage from "./components/MembershipPage";
import MembershipAdminPage from "./components/MembershipAdminPage";
import PaymentPage from "./components/PaymentPage";
import MyMembership from "./components/MyMembership";
import ReturnBook from "./components/ReturnBook";
import BorrowRequests from "./components/BorrowRequests";
import TransactionsPage from "./components/TransactionsPage";
import PendingReservations from "./components/PendingReservations";
import AdminNotifications from "./components/AdminNotifications";
import MemberNotifications from "./components/MemberNotifications";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/dashboard" element={<Dashboard />} /> {/* Optional fallback */}
      
      <Route path="/add-book" element={<AddBook />} />
      <Route path="/update-book/:id" element={<UpdateBook />} />
      <Route path="/delete-book" element={<DeleteBook />} />
      <Route path="/book-detail/:id" element={<BookDetail />} />
      <Route path="/borrowed-books" element={<BorrowedTable />} />
      <Route path="/registered-users" element={<RegisteredUsers />} />
     
      <Route path="/membership" element={<MembershipPage />} />
      <Route path="/membership-admin" element={<MembershipAdminPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/mymembership" element={<MyMembership />} />
      <Route path="/borrow-requests" element={<BorrowRequests />} />    
      <Route path="/admin/return/inspect/:borrowId" element={<ReturnBook />} /> 
      <Route path="/pending-reservations" element={<PendingReservations />} />
      <Route path="/return/:borrowId" element={<ReturnBook />} />
      <Route path="/member/notifications" element={<MemberNotifications />} />
      <Route path="/admin/notifications" element={<AdminNotifications />} />
      <Route
          path="/membership-transactions"
          element={<TransactionsPage transactionType="MEMBERSHIP" />}
        />
        <Route
          path="/penalty-transactions"
          element={<TransactionsPage transactionType="PENALTY" />}
        />
    </Routes>

  );
}

export default App;
