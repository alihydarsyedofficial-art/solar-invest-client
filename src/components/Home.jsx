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
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Solar Invest</h2>
          <p className="text-gray-400">Welcome Back</p>
        </div>
        <div className="w-[45px] h-[45px] rounded-full bg-[#334155]"></div>
      </div>

      {/* Balance Card */}
      <div className="p-6 rounded-[25px] bg-gradient-to-br from-[#06b6d4] to-[#2563eb] shadow-lg mb-6">
        <h3 className="text-sm opacity-80">Total Assets</h3>
        <div className="text-[34px] font-bold mt-2">৳ {balance.toLocaleString()}</div>
      </div>

      {/* Plans Section */}
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
  );
};

export default Home;