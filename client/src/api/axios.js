import axios from 'axios';

const BASE_URL = 'https://jade-faithful-angelfish.cyclic.app/api';

export default axios.create({
  baseURL: BASE_URL,
});
