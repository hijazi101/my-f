import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import { getFirestore, collection, getDocs, query, orderBy, where, doc, deleteDoc } from 'firebase/firestore';
import app from '../firebaseconfig';

const AddToCartButton = ({ postId }) => {
  const router = useRouter();

  const handleAddCart = () => {
    router.push(`/Addtocart?postId=${postId}`);
  };

  return (
    <button
      className="bg-green-500 w-full p-1 mt-1 rounded-md text-white"
      onClick={handleAddCart}
    >
      Add To Cart
    </button>
  );
};

const Hero = () => {
  const { user } = useUser();
  const [userPosts, setUserPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const db = getFirestore(app);

  useEffect(() => {
    getUserPosts();
  }, []);

  const getUserPosts = async () => {
    const q = query(collection(db, 'posts'), orderBy('name'));
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      data.id = doc.id;
      posts.push(data);
    });
    setUserPosts(posts);
  };

  const handleSearch = async (term) => {
    let q;
    if (term.trim() === '') {
      q = query(collection(db, 'posts'), orderBy('name'));
    } else {
      q = query(collection(db, 'posts'), orderBy('name'), where('name', '>=', term.trim()));
    }
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      data.id = doc.id;
      posts.push(data);
    });
    setUserPosts(posts);
  };

  const handleChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    handleSearch(term);
  };

  const onDeletePost = async (postId) => {
    await deleteDoc(doc(db, 'posts', postId));
    getUserPosts(); // Refresh posts after deletion
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div>
        <form className="max-w-md mx-auto">
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Mockups, Logos..."
              onChange={handleChange}
              value={searchTerm}
            />
            <button
              type="submit"
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={(e) => {
                e.preventDefault();
                handleSearch(searchTerm);
              }}
            >
              Search
            </button>
          </div>
        </form>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5 px-10">
        {userPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg overflow-hidden border shadow-md">
            <img src={post.image} alt={post.name} className="w-full h-40 object-cover" style={{ minHeight: '300px' }} />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{post.name}</h3>
              <p className="text-gray-600">${post.price}</p>
              <div className="flex justify-between items-center mt-4">
                <AddToCartButton postId={post.id} />
                {user && user.username === 'admin' && (
                  <div>
                    <button
                      className="bg-gray-500 w-full p-1 mt-1 rounded-md text-white"
                      onClick={() => router.push(`/edit/${post.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-400 w-full p-1 mt-1 rounded-md text-white"
                      onClick={() => onDeletePost(post.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
