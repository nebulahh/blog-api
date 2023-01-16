import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { faEdit, faL } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Editor } from '@tinymce/tinymce-react';

import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
const DRAFT_URL = '/draft';

const SingleDraftPage = () => {
  const { auth } = useAuth();
  const { id } = useParams();
  const [singleDraft, setSingleDraft] = useState({});
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [postTitle, setPostTitle] = useState('');
  const [post, setPost] = useState('');
  const [editor, setEditor] = useState(false);

  useEffect(() => {
    async function getSingleDraft() {
      try {
        const response = await axios.get(DRAFT_URL + '/' + id, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
          withCredentials: true,
        });
        setPost(response?.data?.text);
        setPostTitle(response?.data?.title);
        setSingleDraft(response?.data);
      } catch (error) {
        console.error(error);
      }
    }
    getSingleDraft();
  }, []);

  const deleteDraft = async (draftId) => {
    try {
      const response = await axios.delete(`/draft/${draftId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        withCredentials: true,
      });
      navigate('/draft');
    } catch (error) {
      console.error(error);
    }
  };

  const updateDraft = async () => {
    if (editorRef.current) {
      let desc = editorRef.current.getContent({ format: 'text' });
      try {
        const response = await axios.put(
          '/draft/' + id,
          JSON.stringify({ text: desc, title: postTitle }),
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth.token}`,
            },
            withCredentials: true,
          }
        );
        setEditor(false);
        setSingleDraft(response?.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const publishDraft = async (draftId) => {
    if (editorRef.current) {
      let desc = editorRef.current.getContent({ format: 'text' });
      try {
        const responseFromPublish = await axios.post(
          '/posts',
          JSON.stringify({ text: desc, title: postTitle }),
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth.token}`,
            },
            withCredentials: true,
          }
        );
        const responseFromDeleteDraft = await axios.delete(
          `/draft/${draftId}`,
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
      }
    }
  };

  return (
    <>
      {editor ? (
        <section>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            autoComplete="off"
            value={postTitle}
            required
            onChange={(e) => setPostTitle(e.target.value)}
            name="title"
            className="mb-4"
          />

          <label htmlFor="post">Post</label>
          <Editor
            apiKey="411s6dfe91fgxqt87hs0a3yoou9wfq1ojjablkuio3nhxixx"
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue={post}
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
              onClick={updateDraft}
            >
              Update draft
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white mt-4 mr-auto ml-auto font-bold py-2 px-4 rounded-full border"
              type="submit"
              onClick={() => publishDraft(singleDraft._id)}
            >
              Publish now
            </button>
          </div>
        </section>
      ) : (
        <div className="singlePost">
          <div className="singlePostWrapper md:pl-0">
            <h1 className="singlePostTitle">{singleDraft.title}</h1>
            <div className="singlePostInfo">
              <span className="singlePostDate">
                {new Date(singleDraft.createdAt).toDateString()}
              </span>
              <div>
                <FontAwesomeIcon
                  onClick={() => setEditor(true)}
                  icon={faEdit}
                />
              </div>
              <div
                onClick={() => deleteDraft(singleDraft._id)}
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
            </div>

            <p className="singlePostDesc">{singleDraft.text}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleDraftPage;
