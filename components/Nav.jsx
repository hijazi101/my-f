import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const Nav = () => {
  const router = useRouter();
  const { user } = useUser();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleSignIn = (e) => {
    e.preventDefault();
    router.push('/Signin');
  };

  const handleSignOut = (e) => {
    e.preventDefault();
    sessionStorage.removeItem('username');
    setUsername('');
    router.push('/');
  };

  return (
    <div className="bg-gray-900 text-white">
      <div className="container mx-auto py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">HIJAZI-STORES</h1>
        <ul className="flex space-x-4">
          <li>
            <a href="/" className="flex items-center text-white hover:text-gray-300">
              <span className="hidden sm:block">HOME</span>
            </a>
          </li>
          {user && user.username === 'admin' && (
            <>
             
              <li><a href="/Orderswehave" className="hover:text-gray-300">*Orders We Have*</a></li>
            </>
          )}
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <li><a href="/Orders" className="hover:text-gray-300">My Orders</a></li>
          {user && user.username === 'admin' && (
            <li><a href="/Additem" className="hover:text-gray-300">ADD ITEMS</a></li>
          )}
        </ul>
      </div>
      <div className="container mx-auto py-2 border-t border-gray-600">
        <ul className="flex space-x-4 justify-center">
          <li><a href="/Tablet" className="hover:text-gray-300">TABLETS</a></li>
          <li><a href="/Phones" className="hover:text-gray-300">PHONES</a></li>
          <li><a href="/Laptop" className="hover:text-gray-300">LAPTOPS</a></li>
          <li><a href="/Accessories" className="hover:text-gray-300">ACCESSORIES</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Nav;
