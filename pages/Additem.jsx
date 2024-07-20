import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { app} from '../firebaseconfig';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import Nav from '../components/Nav';
import Toast from '../components/Toast'; // Adjust the import path as needed

const Additem = () => {
  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const [submit, setSubmit] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { user } = useUser();
  const db = getFirestore(app);
  const storage = getStorage(app);

  useEffect(() => {
    if (user) {
      setInputs((values) => ({
        ...values,
        name: user.fullName,
        email: user.emailAddresses[0].emailAddress,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFile(files[0]);
    } else {
      setInputs((values) => ({ ...values, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      const storageRef = ref(storage, `ninja-player/${file.name}`);
      try {
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);
        setInputs((values) => ({ ...values, image: imageUrl }));
        setSubmit(true);
      } catch (error) {
        console.error('Error uploading file: ', error);
      }
    } else {
      console.error('No file selected');
    }
  };

  useEffect(() => {
    if (submit) {
      savePost();
    }
  }, [submit]);

  const savePost = async () => {
    try {
      if (inputs.image) {
        const itemId = Date.now().toString(); // Generate a unique ID
        await setDoc(doc(db, 'posts', itemId), { ...inputs, itemId });
        console.log('Document successfully written!');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        console.error('Image URL not found in inputs object');
      }
      setSubmit(false);
    } catch (error) {
      console.error('Error writing document: ', error);
    }
  };

  return (
    <>
      <Nav />
      {showToast && (
        <div className="absolute top-10 right-10">
          <Toast
            msg="Item Added Successfully"
            closeToast={() => setShowToast(false)}
          />
        </div>
      )}
      <form className="max-w-sm mx-auto pt-20" onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Type
          </label>
          <input
            type="text"
            id="type"
            name="type"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="tablet, phone..."
            required
            onChange={handleChange}
          />
        </div>
        <div className="mb-5">
          <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Price $$
          </label>
          <input
            type="text"
            id="price"
            name="price"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            required
            onChange={handleChange}
          />
        </div>
        <div className="mb-5">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            required
            onChange={handleChange}
          
            
          />
        </div>
        <div className="mb-5">
          <label htmlFor="photo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Photo
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            required
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Create New Item
        </button>
      </form>
    </>
  );
};

export default Additem;
