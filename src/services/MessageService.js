import axios from 'axios';

const CHAT_API_BASE_URL = 'http://localhost:8080/api/messages';

class MessageService {
  
    getChatMessages(token, senderId, receiverId) {
    return axios.post(
      CHAT_API_BASE_URL,
      { senderId, receiverId },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
  }
}

export default new MessageService();
