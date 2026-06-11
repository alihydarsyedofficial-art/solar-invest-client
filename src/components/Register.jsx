import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Register = () => {
  const [step, setStep] = useState(1); // Step 1: Info, Step 2: OTP
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', password: '' });
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [loading, setLoading] = useState(false);

  // ইনপুট হ্যান্ডেল করার ফাংশন
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ইমেইলে OTP পাঠানোর ফাংশন
  const sendOtpEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // ৬ ডিজিটের র্যান্ডম OTP তৈরি
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: otp })
      });

      if (response.ok) {
        alert('OTP sent to your email! Please check your inbox/spam folder.');
        setStep(2); // OTP ইনপুট ফর্মে চলে যাবে
      } else {
        alert('Failed to send OTP.');
      }
    } catch (error) {
      console.error(error);
      alert('Network Error.');
    } finally {
      setLoading(false);
    }
  };

  // OTP ভেরিফাই করে অ্যাকাউন্ট তৈরি করার ফাংশন
  const verifyAndRegister = async (e) => {
    e.preventDefault();
    if (otpInput !== generatedOtp) {
      return alert('Invalid OTP! Please try again.');
    }

    setLoading(true);
    try {
      // ১. Firebase Auth এ ইউজার তৈরি
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // ২. Firestore ডাটাবেসে ইউজারের তথ্য সেভ করা
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        balance: 0,
        role: 'user',
        createdAt: serverTimestamp()
      });

      alert('Registration Successful!');
      // এখানে লগইন পেজে বা ড্যাশবোর্ডে রিডাইরেক্ট করে দেবেন
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-900 min-h-screen flex flex-col justify-center text-white">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-400">Create Account</h2>

        {step === 1 ? (
          <form onSubmit={sendOtpEmail} className="space-y-4">
            <div>
              <label className="block mb-1 text-gray-300">Full Name</label>
              <input type="text" name="name" onChange={handleChange} required className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg" placeholder="John Doe" />
            </div>
            <div>
              <label className="block mb-1 text-gray-300">Phone Number</label>
              <input type="tel" name="phone" onChange={handleChange} required className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg" placeholder="017XXXXXXXX" />
            </div>
            <div>
              <label className="block mb-1 text-gray-300">Email</label>
              <input type="email" name="email" onChange={handleChange} required className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg" placeholder="example@gmail.com" />
            </div>
            <div>
              <label className="block mb-1 text-gray-300">Password</label>
              <input type="password" name="password" onChange={handleChange} required minLength="6" className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg" placeholder="******" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-lg mt-4 transition">
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyAndRegister} className="space-y-4">
            <p className="text-sm text-gray-400 text-center mb-4">We've sent a 6-digit code to <strong>{formData.email}</strong></p>
            <div>
              <label className="block mb-1 text-gray-300">Enter OTP</label>
              <input type="text" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} required className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-center tracking-widest text-lg font-bold" placeholder="123456" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg mt-4 transition">
              {loading ? 'Verifying...' : 'Verify & Register'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;