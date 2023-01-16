import Home from './components/Home';
import Register from './components/Signup/Register';
import Login from './components/Login/Login';
import Layout from './components/Layout';
import SinglePost from './components/SinglePost/SinglePost';
import Admin from './components/Admin';
import ErrorPage from './components/Error/404';
import RequireAuth from './components/RequireAuth';
import Draft from './components/Draft/Draft';
import SingleDraftPage from './components/SingleDraftPage/SingleDraftPage';
import PersistLogin from './components/PersistLogin';
import useAuth from './hooks/useAuth';
import Header from './components/Header/Header';
import { Routes, Route, NavLink } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { useEffect } from 'react';

const queryClient = new QueryClient();

function App() {
  const { setAuth, auth } = useAuth();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setAuth(foundUser);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container">
        <Header />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/post/:id" element={<SinglePost />} />

            <Route element={<PersistLogin />}>
              <Route element={<RequireAuth />}>
                <Route path="/admin" element={<Admin />} />
              </Route>

              <Route element={<RequireAuth />}>
                <Route path="/draft" element={<Draft />} />
              </Route>

              <Route element={<RequireAuth />}>
                <Route path="/draft/:id" element={<SingleDraftPage />} />
              </Route>
            </Route>

            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;
