import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { logoutUser } from '../redux/slices/authSlice';
import { clearCartLocal } from '../redux/slices/cartSlice';

import {
  ShoppingCart,
  Heart,
  User,
  LogOut,
} from 'lucide-react';

import logo from "../assets/logo.jpeg";

export default function Navbar() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { cartItems, wishlistItems } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCartLocal());
    navigate('/');
  };

  const totalCartCount = cartItems.reduce(
    (acc, curr) => acc + curr.count,
    0
  );

  return (

    <nav
      className="
      sticky top-0 z-50
      w-full
      px-4 md:px-10 py-4
      flex items-center justify-between
      backdrop-blur-xl
      bg-[#F5F3E7]/90
      border-b border-[#6A994E]/20
      shadow-lg
      "
    >

      {/* LEFT SIDE */}
      <Link to="/" className="flex items-center space-x-3">

        {/* LOGO IMAGE */}
        <img
          src={logo}
          alt="Dhara Logo"
          className="
          w-12 h-12
          rounded-full
          object-cover
          border-2 border-[#6A994E]
          shadow-md
          "
        />

        {/* LOGO TEXT */}
        <div>

          <h1 className="text-2xl font-black text-[#1B4332] tracking-tight">
            DHARA
          </h1>

          <p className="text-[9px] uppercase tracking-[3px] text-[#6A994E] font-bold">
            Kerala Hyperlocal
          </p>

        </div>

      </Link>

      {/* CENTER MENU */}
      <div className="hidden md:flex items-center space-x-8">

        <Link
          to="/"
          className="
          text-[#1B4332]
          font-semibold
          hover:text-[#D4A017]
          transition-all
          "
        >
          Home
        </Link>

        <Link
          to="/about"
          className="
          text-[#1B4332]
          font-semibold
          hover:text-[#D4A017]
          transition-all
          "
        >
          About
        </Link>

        <Link
          to="/dashboard"
          className="
          text-[#1B4332]
          font-semibold
          hover:text-[#D4A017]
          transition-all
          "
        >
          Marketplace
        </Link>

        <Link
          to="/contact"
          className="
          text-[#1B4332]
          font-semibold
          hover:text-[#D4A017]
          transition-all
          "
        >
          Contact
        </Link>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center space-x-3">

        {user ? (

          <>

            {/* WISHLIST */}
            <Link
              to="/wishlist"
              className="
              relative
              p-2
              rounded-xl
              hover:bg-[#6A994E]/10
              transition-all
              "
            >

              <Heart className="w-5 h-5 text-[#1B4332]" />

              {wishlistItems.length > 0 && (

                <span
                  className="
                  absolute -top-1 -right-1
                  w-5 h-5
                  rounded-full
                  bg-red-500
                  text-white
                  text-[10px]
                  flex items-center justify-center
                  font-bold
                  "
                >
                  {wishlistItems.length}
                </span>

              )}

            </Link>

            {/* CART */}
            <Link
              to="/cart"
              className="
              relative
              p-2
              rounded-xl
              hover:bg-[#6A994E]/10
              transition-all
              "
            >

              <ShoppingCart className="w-5 h-5 text-[#1B4332]" />

              {totalCartCount > 0 && (

                <span
                  className="
                  absolute -top-1 -right-1
                  w-5 h-5
                  rounded-full
                  bg-[#6A994E]
                  text-white
                  text-[10px]
                  flex items-center justify-center
                  font-bold
                  "
                >
                  {totalCartCount}
                </span>

              )}

            </Link>

            {/* PROFILE */}
            <Link
              to={user.role === 'farmer' ? '/farmer' : '/profile'}
              className="
              hidden sm:flex
              items-center space-x-2
              px-3 py-2
              rounded-xl
              bg-[#6A994E]/10
              hover:bg-[#6A994E]/20
              border border-[#6A994E]/20
              transition-all
              "
            >

              <User className="w-4 h-4 text-[#6A994E]" />

              <span className="text-sm font-semibold text-[#1B4332]">
                {user.name.split(' ')[0]}
              </span>

            </Link>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="
              p-2
              rounded-xl
              bg-red-100
              hover:bg-red-200
              text-red-500
              transition-all
              "
            >

              <LogOut className="w-4 h-4" />

            </button>

          </>

        ) : (

          <div className="flex items-center space-x-3">

            {/* LOGIN */}
            <Link
              to="/login"
              className="
              text-[#1B4332]
              font-semibold
              hover:text-[#D4A017]
              transition-all
              "
            >
              Log In
            </Link>

            {/* SIGNUP */}
            <Link
              to="/signup"
              className="
              bg-[#6A994E]
              hover:bg-[#D4A017]
              text-white
              font-bold
              px-5 py-2.5
              rounded-xl
              transition-all
              shadow-md
              "
            >
              Sign Up
            </Link>

          </div>

        )}

      </div>

    </nav>
  );
}
