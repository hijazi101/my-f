import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';
import app from '../firebaseconfig';
import Nav from '../components/Nav';
import Toast from '../components/Toast';

const Accessories = () => {
  const router = useRouter();
  const { user } = useUser(); // Retrieve user data from Clerk
  const [userPost, setUserPost] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [editData, setEditData] = useState({ name: '', price: '', image: '' });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const db = getFirestore(app);

  useEffect(() => {
    getUserPost();
  }, []);

  const getUserPost = async () => {
    const q = query(collection(db, "posts"), where("type", "==", "accessories"));
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      data.id = doc.id;
      posts.push(data);
    });
    setUserPost(posts);
  };

  const onDeletePost = async (id) => {
    await deleteDoc(doc(db, "posts", id));
    setToastMessage('Item Deleted Successfully');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    // You may want to remove the reload here and update state instead
    // window.location.reload();
  };

  const onEditPost = (post) => {
    setEditingPost(post.id);
    setEditData({ name: post.name, price: post.price, image: post.image });
    setToastMessage('Edit Mode Activated');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const postRef = doc(db, "posts", editingPost);
    await updateDoc(postRef, editData);
    setToastMessage('Item Edited Successfully');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setEditingPost(null);
  };

  const AddToCartButton = ({ postId }) => {
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

  return (
    <div className='bg-gray-100 min-h-screen'>
      <Nav />
      {showToast && (
        <div className="absolute top-10 right-10">
          <Toast
            msg={toastMessage}
            closeToast={() => setShowToast(false)}
          />
        </div>
      )}
      <p className="text-2xl font-semibold mt-4 px-10">Manage Your Posts</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5 px-10">
        {userPost.map((post) => (
          <div key={post.id} className="bg-white rounded-lg overflow-hidden border shadow-md">
            <img src={post.image} alt={post.name} className="w-full h-40 object-cover" />
            <div className="p-4">
              {editingPost === post.id ? (
                <form onSubmit={handleEditSubmit}>
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    className="border p-2 mb-2 w-full"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    name="price"
                    value={editData.price}
                    onChange={handleEditChange}
                    className="border p-2 mb-2 w-full"
                    placeholder="Price"
                  />
                  <input
                    type="text"
                    name="image"
                    value={editData.image}
                    onChange={handleEditChange}
                    className="border p-2 mb-2 w-full"
                    placeholder="Image URL"
                  />
                  <button
                    type="submit"
                    className="bg-green-500 w-full p-1 mt-1 rounded-md text-white"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 w-full p-1 mt-1 rounded-md text-white"
                    onClick={() => setEditingPost(null)}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-2">{post.name}</h3>
                  <p className="text-gray-600">${post.price}</p>
                  <div className="p-4">
                    <AddToCartButton postId={post.id} />
                  </div>
                  {user && user.username === "admin" && (
                    <>
                      <button
                        className="bg-gray-500 w-full p-1 mt-1 rounded-md text-white"
                        onClick={() => onEditPost(post)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-400 w-full p-1 mt-1 rounded-md text-white"
                        onClick={() => onDeletePost(post.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accessories;
