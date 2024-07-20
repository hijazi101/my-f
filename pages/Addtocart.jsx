import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { SignIn, useUser, RedirectToSignIn } from '@clerk/nextjs';
import { app} from '../firebaseconfig';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import Nav from '../components/Nav';

const Addtocart = () => {
  const router = useRouter();
  const { postId } = router.query; // Retrieve the postId from the query parameters
  const { isLoaded, isSignedIn, user } = useUser(); // Use Clerk's useUser hook
  const db = getFirestore(app);
  const [formData, setFormData] = useState({
    fullName: '',
    city: '',
    address: '',
    phoneNb: '',
  });

  useEffect(() => {
    if (isSignedIn) {
      setFormData((prevData) => ({
        ...prevData,
        fullName: user?.fullName || '',
      }));
    }
  }, [isSignedIn, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postId) {
      alert('Please select a post.');
      return;
    }

    const newDoc = {
      itemId: postId,
      isDelivered: 0,
      isBuyed: 1,
      address: formData.address,
      username: formData.fullName,
      city: formData.city,
      phoneNb: formData.phoneNb,
    };

    try {
      await setDoc(doc(db, 'orders', Date.now().toString()), newDoc);
      console.log('Document successfully written!');
      router.push('/');
    } catch (error) {
      console.error('Error writing document: ', error);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>; // Optionally, show a loading state
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return (
    <>
      <Nav />
      
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Payment</h2>
            <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12">
              <form
                onSubmit={handleSubmit}
                className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 lg:max-w-xl lg:p-8"
              >
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="full_name"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Full name *
                    </label>
                    <input
                      type="text"
                      id="full_name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                      placeholder="Bonnie Green"
                      required
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="city"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                      placeholder=""
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                      placeholder=""
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phoneNb"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="number"
                      id="phoneNb"
                      name="phoneNb"
                      value={formData.phoneNb}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                      placeholder=""
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center bg-slate-500 justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-auto"
                >
                  Confirm order
                </button>
              </form>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => router.back()}
                className="text-sm font-medium text-primary-600 dark:text-primary-500 hover:underline"
              >
                <svg
                  className="mr-2 inline-block h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back to shop
              </button>
              <button
                type="button"
                className="text-sm font-medium text-primary-600 dark:text-primary-500 hover:underline"
              >
                Next step
                <svg
                  className="ml-2 inline-block h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Addtocart;
