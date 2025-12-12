import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

export default function Login() {
  const navigate = useNavigate();

  const handleLoginSuccess = (credentialResponse) => {
    try {
      const decoded = jwt_decode(credentialResponse.credential);
      console.log("Login Successful:", decoded);
      
      // Use Google user id (sub) if available
      const userId = decoded.sub;
      localStorage.setItem('userId', userId);
      console.log("userId saved to localStorage:", userId);
      
      navigate('/transactions');
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  const handleLoginError = () => {
    console.log("Login Failed");
  };

  return (
    <section className="login-page">
      <h1>Welcome to your Personal Finance Dashboard </h1>
      <p>you can keep track of all your finances with this one tool!</p>

      <h2>Login</h2>
      <p><em>OR</em></p>
      
      <section className="google-login-button">
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
          size="medium"
          theme="filled_black"
        />
      </section>
      
    </section>

  );
}