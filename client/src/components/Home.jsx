import FetchPostQuery from './Post/FetchPostQuery';
import './styles/App.min.css';
import './styles/App.css';
import Footer from './Footer/Footer';

const Home = () => {
  return (
    <div>
      <FetchPostQuery />
      <Footer />
    </div>
  );
};

export default Home;
