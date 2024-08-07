import axios from 'axios';

const USER_API_BASE_URL = 'http://localhost:8080/users';

class UserService {
  getUsers(token, userId, searchQuery) {
    return axios.get(USER_API_BASE_URL + "?user=" + userId + "&searchParam=" + searchQuery, {
      headers: { 
        Authorization: `Bearer ${token}`
      },
    });
  }

  getUsers2(token) {
    console.log(token);
    return axios.get(USER_API_BASE_URL + "", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
  }
}
export default new UserService();
