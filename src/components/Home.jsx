import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';

const Home = () => {
  const [balance, setBalance] = useState(0);
  const [plans, setPlans] = useState([]);
  const [userUid, setUserUid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUid(user.uid);
        const userSnap = await getDoc(doc(db, 'users', user.uid));
        if (userSnap.exists()) setBalance(userSnap.data().balance || 0);
      }
    });

    const fetchPlans = async () => {
      const querySnapshot = await getDocs(collection(db, 'plans'));
      setPlans(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };

    fetchPlans();
    return () => unsubscribe();
  }, []);

  const handleJoin = async (plan) => {
    if (!userUid) return alert("Please login first!");
    if (balance < plan.price) return alert("Insufficient balance!");

    try {
      await updateDoc(doc(db, 'users', userUid), { balance: balance - plan.price });
      await addDoc(collection(db, 'investments'), {
        userId: userUid,
        planName: plan.name,
        price: plan.price,
        daily: plan.daily,
        status: 'Active',
        date: serverTimestamp()
      });
      setBalance(prev => prev - plan.price);
      alert("Successfully joined " + plan.name);
    } catch (e) {
      alert("Error processing transaction");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-24 font-['Poppins',sans-serif]">
      {/* Header */}
      <div className="p-5 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Solar Invest</h2>
          <p className="text-gray-400">Welcome Back</p>
        </div>
        <div className="w-[45px] h-[45px] rounded-full bg-[#334155]"></div>
      </div>

      {/* Balance Card */}
      <div className="m-4 p-6 rounded-[25px] bg-gradient-to-br from-[#06b6d4] to-[#2563eb] shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <h3 className="text-sm opacity-80">Total Assets</h3>
        <div className="text-[34px] font-bold mt-2">৳ {balance.toLocaleString()}</div>
        <div className="mt-2 text-[#d1fae5]">Real-time Assets</div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-2.5 p-4">
        {['💰 Deposit', '🏧 Withdraw', '👥 Invite', '📈 Income'].map((item, i) => (
          <div key={i} className="bg-[#1e293b] p-4 rounded-[18px] text-center text-xs">
            <span className="text-2xl block mb-2">{item.split(' ')[0]}</span>
            {item.split(' ')[1]}
          </div>
        ))}
      </div>

      {/* VIP */}
      <div className="bg-gradient-to-br from-[#f59e0b] to-[#f97316] m-4 p-5 rounded-[20px]">
        <h2 className="text-[22px] font-bold">VIP Solar Plan</h2>
        <p className="mt-1 opacity-90">Daily Profit Up To 5%</p>
      </div>

      {/* Plans Section */}
      <div className="p-4">
        <div className="text-lg font-semibold mb-4">Investment Plans</div>
        {loading ? <p className="text-center">Loading...</p> : plans.map(plan => (
          <div key={plan.id} className="bg-[#1e293b] p-5 rounded-[18px] mb-3 flex justify-between items-center">
            <div>
              <h4 className="font-bold">{plan.name}</h4>
              <p className="text-gray-400 text-sm">Invest ৳{plan.price}</p>
            </div>
            <button onClick={() => handleJoin(plan)} className="bg-[#22c55e] px-5 py-2.5 rounded-[10px] font-semibold">Join</button>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="bg-[#1e293b] p-5 rounded-[18px]">
          <h4 className="text-gray-400 text-xs">Total Profit</h4>
          <p className="text-2xl font-bold mt-2">৳52K</p>
        </div>
        <div className="bg-[#1e293b] p-5 rounded-[18px]">
          <h4 className="text-gray-400 text-xs">Referral Bonus</h4>
          <p className="text-2xl font-bold mt-2">৳11K</p>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 w-full bg-[#111827] p-4 flex justify-around border-t border-[#1e293b]">
        {['🏠 Home', '📊 Market', '💼 Portfolio', '👤 Profile'].map((nav, i) => (
          <div key={i} className="text-center text-xs">{nav.split(' ')[0]}<br/>{nav.split(' ')[1]}</div>
        ))}
      </div>
    </div>
  );
};

export default Home;