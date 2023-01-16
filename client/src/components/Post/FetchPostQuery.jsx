import usePosts from '../../hooks/usePosts';
import { Link } from 'react-router-dom';

const FetchPostQuery = () => {
  const onSuccess = () => {
    console.log('Data retrieved');
  };

  const onError = () => {
    console.log('Error');
  };
  const { isLoading, data, isError, error } = usePosts(onSuccess, onError);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  return (
    <>
      <div className="jumbotron p-3 p-md-5 text-white rounded bg-dark">
        <div className="col-md-6 px-0">
          <h1 className="display-4 font-italic">Welcome to my blog.</h1>
        </div>
      </div>
      <p className="border-bottom">List of posts</p>
      {data?.data.map((post) => {
        return (
          <div className="blog-post" key={post._id}>
            <Link to={`/post/${post._id}`}>
              <h2 className="blog-post-title">{post.title}</h2>{' '}
            </Link>
            <p className="blog-post-meta">
              Posted on: {new Date(post.createdAt).toDateString()} by:{' '}
              {post?.posted_by?.name}
            </p>
            <p>{post.text.slice(0, 118)}...</p>
          </div>
        );
      })}
    </>
  );
};

export default FetchPostQuery;
