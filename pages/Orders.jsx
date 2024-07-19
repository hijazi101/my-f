import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { app, db } from '../firebaseconfig';  // Use named import
import Nav from '../components/Nav';
import { useUser } from '@clerk/nextjs';

const Orders = () => {
  const [userPosts, setUserPosts] = useState([]);
  const { isLoaded, user } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserOrders(user);
    }
  }, [isLoaded, user]);

  const fetchUserOrders = async (user) => {
    try {
      const username = user.fullName || user.username;
      console.log('Fetching orders for username:', username);

      const ordersQuery = query(
        collection(db, 'orders'),
        where('username', '==', username),
        where('isDelivered', '==', 0)
      );
      const ordersSnapshot = await getDocs(ordersQuery);

      if (ordersSnapshot.empty) {
        console.log('No matching documents.');
        return;
      }

      const postsPromises = ordersSnapshot.docs.map(async (orderDoc) => {
        const orderData = orderDoc.data();
        const postId = orderData.itemId;

        const postDoc = await getDoc(doc(db, 'posts', postId));
        if (postDoc.exists()) {
          const postData = postDoc.data();
          return { id: orderDoc.id, ...orderData, ...postData };
        } else {
          console.warn(`Post with ID ${postId} not found.`);
          return null;
        }
      });

      const resolvedPosts = await Promise.all(postsPromises);
      const validPosts = resolvedPosts.filter(post => post !== null);

      console.log('Fetched posts:', validPosts);
      setUserPosts(validPosts);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <div>
      <Nav />
      <div className="bg-gray-100 min-h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5 px-10">
          {userPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg overflow-hidden border shadow-md">
              <img
                src={post.image}
                alt={post.name}
                className="w-full h-auto object-cover object-center"
                style={{ minHeight: '300px' }}
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{post.name}</h3>
                <p className="text-gray-600">Price: ${post.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
