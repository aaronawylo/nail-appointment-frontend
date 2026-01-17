import { login } from "../auth";

export default function Login() {
  return (
    <div className="login">
      <h2>💖 Please log in 💖</h2>
      <button onClick={login}>Login with Cognito 🌸</button>
    </div>
  );
}
