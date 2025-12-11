import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from "@react-oauth/google";

export default function Login() {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      console.log("Login Successful:", credentialResponse);
      
      // Store userId from Google token
      localStorage.setItem('userId', credentialResponse.access_token);
      
      navigate('/transactions');
    },
    onError: () => {
      console.log("Login Failed");
    }
  });

  return (
    <>
    <section className="login-page">
      <h1>Welcome to your Personal Finance Dashboard </h1>
      <p>you can keep track of all your finances with this one tool!</p>

      <h2>Login</h2>
      {/*
      <label>
        Email:
        <input type="email" name="email" placeholder="enter your email"/> 
      </label>
      <br/>
      <label>
        Password:
        <input type="password" name="password" placeholder="enter your password"/>
      </label>
      <br/>
      <button className="login-button" type="button" onClick={() => navigate('/transactions')}>Login</button>
      */}
      <p><em>OR</em></p>

      <button className="google-login-button" onClick={() => login()}>
        Sign in with Google
      </button>
    </section>
    </>
  );
}