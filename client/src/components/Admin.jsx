import useLogout from '../hooks/useLogout';
import { useNavigate, NavLink } from 'react-router-dom';
import { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
const POST_URL = '/posts';
const DRAFT_URL = '/draft';

const Admin = () => {
  const [post, setPost] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [onSuccess, setOnSuccess] = useState('');
  const [error, setError] = useState('');
  const logout = useLogout();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const editorRef = useRef(null);
  const publish = async (e) => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent({ format: 'text' }));
      setPost(editorRef.current.getContent({ format: 'text' }));
      setPostTitle(postTitle);
      try {
        const response = await axios.post(
          POST_URL,
          JSON.stringify({ text: post, title: postTitle }),
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth.token}`,
            },
            withCredentials: true,
          }
        );
        navigate('/');
      } catch (error) {
        console.error(error);
        await logout();
        navigate('/');
      }
    }
  };

  const toDraft = async () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent({ format: 'text' }));
      setError('Try again');
      setPost(editorRef.current.getContent({ format: 'text' }));
      try {
        const response = await axios.post(
          DRAFT_URL,
          JSON.stringify({ text: post, title: postTitle }),
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth.token}`,
            },
            withCredentials: true,
          }
        );
        setOnSuccess(response.data);
        setError('');
        editorRef.current = '';
        navigate('/draft');
      } catch (error) {
        console.error(error);
        await logout();
        navigate('/');
      }
    }
  };

  const signOut = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <div className="flexGrow mb-3">
        <NavLink
          to={'/draft'}
          className="mr-3 bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded-full"
        >
          Show Drafts
        </NavLink>
        <NavLink
          onClick={signOut}
          className="mr-3 bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded-full"
        >
          Sign Out
        </NavLink>
      </div>

      {onSuccess.title ? <p>Post is added to drafts</p> : null}
      {error ? <p>Try again</p> : null}
      <section>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          autoComplete="off"
          required
          onChange={(e) => setPostTitle(e.target.value)}
          name="title"
          className="mb-4"
        />

        <label htmlFor="post">Post</label>
        <Editor
          apiKey="411s6dfe91fgxqt87hs0a3yoou9wfq1ojjablkuio3nhxixx"
          onInit={(evt, editor) => (editorRef.current = editor)}
          initialValue=""
          init={{
            height: 500,
            menubar: false,
            plugins: [
              'advlist',
              'autolink',
              'lists',
              'link',
              'image',
              'charmap',
              'preview',
              'anchor',
              'searchreplace',
              'visualblocks',
              'code',
              'fullscreen',
              'insertdatetime',
              'media',
              'table',
              'code',
              'help',
              'wordcount',
            ],
            toolbar:
              'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style:
              'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          }}
        />
        <div className="flex">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white mt-4 mr-auto ml-auto font-bold py-2 px-4 rounded-full border"
            type="submit"
            onClick={toDraft}
          >
            Save to draft
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white mt-4 mr-auto ml-auto font-bold py-2 px-4 rounded-full border"
            type="submit"
            onClick={publish}
          >
            Publish now
          </button>
        </div>
      </section>
    </>
  );
};
export default Admin;
