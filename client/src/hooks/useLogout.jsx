import axios from "../api/axios"
import useAuth from './useAuth'

const useLogout = () => {
  const {setAuth} = useAuth()

  const logout = async () => {
    setAuth({})
    localStorage.clear()
    try {
      const response = await axios('/user/logout', {
        withCredentials: true
      })
    } catch (error) {
      console.error(error);
    }
  }
  return logout
}

export default useLogout