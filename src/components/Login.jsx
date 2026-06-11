import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // পেজ চেঞ্জ করার জন্য

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login Successful!');
      navigate('/'); // লগইন সফল হলে ড্যাশবোর্ড বা হোমে নিয়ে যাবে
    } catch (error) {
      console.error(error);
      alert('Invalid Email or Password!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-900 min-h-screen flex flex-col justify-center text-white">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-400">Welcome Back</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-300">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white" 
              placeholder="example@gmail.com" 
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white" 
              placeholder="******" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-lg mt-4 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400 text-sm">
          Don't have an account? <Link to="/register" className="text-green-400 font-bold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;