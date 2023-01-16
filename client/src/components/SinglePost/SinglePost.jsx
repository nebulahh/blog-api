import usePost from '../../hooks/usePost';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/App.min.css';
import '../styles/App.css';
import './SinglePost.css';
import '../../index.css';
import { useState } from 'react';

import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
const LOGIN_URL = '/user/login';

const SinglePostPage = () => {
  const [username, setUsername] = useState('');
  const [comment, setComment] = useState('');
  const { auth } = useAuth();
  const navigate = useNavigate();

  const { id } = useParams();
  const { isLoading, isError, data, error } = usePost(id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `/posts/${id}/comments`,
        JSON.stringify({ username, text: comment }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      setComment('');
      setUsername('');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `/posts/${id}/comments/${commentId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
          withCredentials: true,
        }
      );
      setComment('');
      setUsername('');
    } catch (error) {
      console.error(error);
    }
  };

  const deletePost = async (id) => {
    try {
      const response = await axios.delete(`/posts/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        withCredentials: true,
      });
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  return (
    <>
      <div className="singlePost">
        <div className="singlePostWrapper md:pl-0">
          <h1 className="singlePostTitle">{data?.data.title}</h1>
          <div className="singlePostInfo">
            <span className="singlePostDate">
              {new Date(data?.data.createdAt).toDateString()}
            </span>

            {auth?.email ? (
              <div
                onClick={() => deletePost(data?.data?._id)}
                className="w-4 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xml:space="preserve"
                  viewBox="0 0 16 16"
                >
                  <g className="icon-color">
                    <path d="M7 5H6v8h1zM10 5H9v8h1z" />
                    <path d="M13 3h-2v-.75C11 1.56 10.44 1 9.75 1h-3.5C5.56 1 5 1.56 5 2.25V3H3v10.75c0 .69.56 1.25 1.25 1.25h7.5c.69 0 1.25-.56 1.25-1.25V3zm-7-.75A.25.25 0 0 1 6.25 2h3.5a.25.25 0 0 1 .25.25V3H6v-.75zm6 11.5a.25.25 0 0 1-.25.25h-7.5a.25.25 0 0 1-.25-.25V4h8v9.75z" />
                    <path d="M13.5 4h-11a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1z" />
                  </g>
                </svg>
              </div>
            ) : null}
          </div>

          <p className="singlePostDesc">{data?.data.text}</p>

          <div className="mt-8 md:mr-auto md:ml-auto md:mt-0 md:mb-0">
            <h3 className="mt-4 text-3xl mb-4">Comment section</h3>

            {data?.data?.comment.length === 0 ? (
              <p>No comment.</p>
            ) : (
              data?.data?.comment.map((comm) => {
                return (
                  <div
                    key={comm._id}
                    className="flex justify-center relative top-1/3"
                  >
                    <div className="relative grid grid-cols-1 gap-4 w-full p-4 mb-8 border rounded-lg bg-wheat shadow-lg">
                      <div className="relative flex gap-4">
                        <div className="flex flex-col w-full">
                          <div className="flex flex-row justify-between">
                            <p className="relative text-xl whitespace-nowrap truncate overflow-hidden">
                              {comm.username}
                            </p>
                            <a className="text-gray-500 text-xl" href="#">
                              <i className="fa-solid fa-trash"></i>
                            </a>
                          </div>
                          <p className="text-gray-400 text-sm">
                            {new Date(comm.createdAt).toDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="-mt-4 text-gray-500">{comm.text}</p>
                      {auth?.email ? (
                        <div
                          onClick={() => deleteComment(comm._id)}
                          className="w-4 cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xml:space="preserve"
                            viewBox="0 0 16 16"
                          >
                            <g className="icon-color">
                              <path d="M7 5H6v8h1zM10 5H9v8h1z" />
                              <path d="M13 3h-2v-.75C11 1.56 10.44 1 9.75 1h-3.5C5.56 1 5 1.56 5 2.25V3H3v10.75c0 .69.56 1.25 1.25 1.25h7.5c.69 0 1.25-.56 1.25-1.25V3zm-7-.75A.25.25 0 0 1 6.25 2h3.5a.25.25 0 0 1 .25.25V3H6v-.75zm6 11.5a.25.25 0 0 1-.25.25h-7.5a.25.25 0 0 1-.25-.25V4h8v9.75z" />
                              <path d="M13.5 4h-11a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1z" />
                            </g>
                          </svg>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="flex mx-auto items-center justify-center shadow-lg mb-4 max-w-lg">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl bg-wheat rounded-lg px-4 pt-2"
        >
          <div className="flex flex-wrap -mx-3 mb-6">
            <h2 className="px-4 pt-3 pb-2 text-gray-800 text-lg">
              Add a new comment
            </h2>

            <div className="w-full md:w-full px-3 mb-2 mt-2">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-10 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
                name="username"
                required
                id="username"
              />
            </div>
            <div className="w-full md:w-full px-3 mb-2 mt-2">
              <label htmlFor="text">Comment:</label>
              <textarea
                onChange={(e) => setComment(e.target.value)}
                className="bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
                name="text"
                placeholder="Type Your Comment"
                required
              ></textarea>
            </div>
            <div className="w-full md:w-full flex justify-center px-3">
              <div className="-mr-1">
                <button
                  type="submit"
                  className="bg-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default SinglePostPage;
