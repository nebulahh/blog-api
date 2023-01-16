import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

import axios from '../../api/axios';
const DRAFT_URL = '/draft';

const Draft = () => {
  const { auth, setAuth } = useAuth();
  const [draft, setDraft] = useState();

  useEffect(() => {
    async function getDrafts() {
      try {
        const response = await axios.get(DRAFT_URL, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
          withCredentials: true,
        });
        setDraft(response?.data);
      } catch (error) {
        console.error(error);
        setAuth({})
        localStorage.clear()
      }
    }
    getDrafts();
  }, []);

  return (
    <>
      <div className="jumbotron p-3 p-md-5 text-white rounded bg-dark">
        <div className="col-md-6 px-0">
          <h1 className="display-4 font-italic">Drafts</h1>
        </div>
      </div>
      {draft?.length === 0 ? (
        <p>No Drafts</p>
      ) : (
        draft?.map((post) => {
          return (
            <div className="blog-post" key={post._id}>
              <Link to={`/draft/${post._id}`}>
                <h2 className="blog-post-title">{post.title}</h2>{' '}
              </Link>
              <p className="blog-post-meta">
                Posted on: {new Date(post.createdAt).toDateString()} by:{' '}
                {post?.posted_by?.name}
              </p>
              <p>{post.text.slice(0, 118)}...</p>
            </div>
          );
        })
      )}
    </>
  );
};

export default Draft;
