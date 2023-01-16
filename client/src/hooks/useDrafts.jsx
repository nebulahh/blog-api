import { useQuery } from "react-query"
import axios from "axios"


const fetchDrafts = () => {
  return axios.get(`http://localhost:9000/api/draft`)
}

const useDrafts = (onSuccess, onError) => {
  return useQuery('drafts', fetchDrafts, {
    onSuccess,
    onError
  })
}

export default useDrafts