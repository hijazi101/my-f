import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useUser, SignedIn, SignedOut, SignIn } from '@clerk/nextjs';
import Nav from '../components/Nav';
import { app} from '../firebaseconfig';

const Orderswehave = () => {
  const [undeliveredOrders, setUndeliveredOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const db = getFirestore(app);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      // Fetch undelivered orders
      const undeliveredQuery = query(collection(db, 'orders'), where('isDelivered', '==', 0));
      const undeliveredSnapshot = await getDocs(undeliveredQuery);

      const undeliveredOrders = await Promise.all(undeliveredSnapshot.docs.map(async (orderDoc) => {
        const orderId = orderDoc.id;
        const orderData = orderDoc.data();
        const postId = orderData.itemId;

        // Fetch post details from 'posts' collection
        const postDoc = await getDoc(doc(db, 'posts', postId));
        if (postDoc.exists()) {
          const postData = postDoc.data();
          return {
            id: orderId,
            itemid: orderData.itemId,
            price: postData.price,
            username: orderData.username,
            address: orderData.address,
            city: orderData.city,
          };
        } else {
          console.warn(`Post with ID ${postId} not found.`);
          return null;
        }
      }));

      setUndeliveredOrders(undeliveredOrders.filter(order => order !== null));

      // Fetch delivered orders
      const deliveredQuery = query(collection(db, 'orders'), where('isDelivered', '==', 1));
      const deliveredSnapshot = await getDocs(deliveredQuery);

      const deliveredOrders = await Promise.all(deliveredSnapshot.docs.map(async (orderDoc) => {
        const orderId = orderDoc.id;
        const orderData = orderDoc.data();
        const postId = orderData.itemId;

        // Fetch post details from 'posts' collection
        const postDoc = await getDoc(doc(db, 'posts', postId));
        if (postDoc.exists()) {
          const postData = postDoc.data();
          return {
            id: orderId,
            itemid: orderData.itemId,
            price: postData.price,
            username: orderData.username,
            address: orderData.address,
            city: orderData.city,
          };
        } else {
          console.warn(`Post with ID ${postId} not found.`);
          return null;
        }
      }));

      setDeliveredOrders(deliveredOrders.filter(order => order !== null));
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleDeliverySubmit = async (orderId) => {
    try {
      // Update 'isDelivered' status to 1 in Firestore
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        isDelivered: 1,
      });

      // Refetch orders after update
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  return (
    <div>
      <Nav />
      <SignedIn>
        <div className="container mx-auto py-4">
          <h1 className="text-2xl font-bold mb-4">Undelivered Orders</h1>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {undeliveredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{order.itemid}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${order.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleDeliverySubmit(order.id);
                    }} className="flex items-center">
                      <input type="checkbox" id={`isdelivered-${order.id}`} name={`isdelivered-${order.id}`} className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                      <label htmlFor={`isdelivered-${order.id}`} className="text-sm font-medium text-gray-900">Delivered</label>
                      <button type='submit' className="ml-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="container mx-auto py-4">
          <h1 className="text-2xl font-bold mb-4">Delivered Orders</h1>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deliveredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{order.itemid}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${order.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SignedIn>
      <SignedOut>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </SignedOut>
    </div>
  );
};

export default Orderswehave;
