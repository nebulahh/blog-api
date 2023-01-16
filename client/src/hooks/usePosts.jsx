import { useQuery } from "react-query"
import axios from "axios"


const fetchPost = () => {
  return axios.get(`http://localhost:9000/api`)
}

const usePosts = (onSuccess, onError) => {
  return useQuery('posts', fetchPost, {
    onSuccess,
    onError
  })
}

export default usePosts