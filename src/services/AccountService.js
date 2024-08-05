import axios from "axios";

const ACCOUNT_API_BASE_URL = "http://localhost:8080/auth";

class AccountService {
  signIn(loginReq) {
    return axios.post(ACCOUNT_API_BASE_URL + "/signin", loginReq)
  }

  signUp(signUpReq) {
    return axios.post(ACCOUNT_API_BASE_URL + "/signup", signUpReq)
  }

  // forgotPassword(email) {
  //   return axios.post(ACCOUNT_API_BASE_URL + "/forgot-password?email=" + email)
  // }

  // recoveryPassword(passwordResetToken) {
  //   return axios.patch(ACCOUNT_API_BASE_URL + "/recovery-password", passwordResetToken);
  // }

  signOut(token) {
    return axios.post(ACCOUNT_API_BASE_URL + "/logout", {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
  }

}

export default new AccountService();