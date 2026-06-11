import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { Zap, Wallet, TrendingUp, ShieldCheck, ChevronRight, AlertCircle } from 'lucide-react';

const Home = () => {
  const [balance, setBalance] = useState(0);
  const [userUid, setUserUid] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(null); 
  const [plans, setPlans] = useState([]);
  const [fetchingPlans, setFetchingPlans] = useState(true);

  // ফায়ারবেস থেকে ডেটা ফেচিং লজিক (আগের মতোই)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUid(user.uid);
        const userDocRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          setBalance(userSnap.data().balance || 0);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'plans'));
        const plansData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPlans(plansData);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setFetchingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  const handleBuyPlan = async (plan) => {
    if (!userUid) return alert('Please login first!');
    setLoadingPlan(plan.id);

    try {
      const userDocRef = doc(db, 'users', userUid);
      const userSnap = await getDoc(userDocRef);
      
      if (!userSnap.exists()) return alert("User account not found!");

      const currentBalance = userSnap.data().balance || 0;
      if (currentBalance < plan.price) {
         alert('Insufficient balance! Please add money to your wallet.');
         setLoadingPlan(null);
         return;
      }

      const newBalance = currentBalance - plan.price;
      await updateDoc(userDocRef, { balance: newBalance });
      await addDoc(collection(db, 'investments'), {
        userId: userUid,
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        dailyReturn: plan.daily,
        validity: plan.validity,
        status: 'Active',
        purchasedAt: serverTimestamp()
      });

      setBalance(newBalance);
      alert(`🎉 Successfully purchased ${plan.name}!`);
    } catch (error) {
      console.error("Error buying plan: ", error);
      alert('Transaction failed! Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] text-slate-200 pb-24 font-sans">
      
      <div className="p-5 max-w-md mx-auto">
        {/* Top Header - Glassmorphism */}
        <div className="flex justify-between items-center mb-8 pt-4">
          <div>
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight">
              Solar Invest
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-medium">
              <Zap size={12} className="text-yellow-400" /> Powering the future
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <ShieldCheck size={20} className="text-emerald-400" />
          </div>
        </div>

        {/* Premium Balance Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-900 rounded-3xl p-6 mb-8 shadow-[0_10px_40px_-10px_rgba(16,185,129,0.5)] border border-emerald-500/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <p className="text-emerald-100 text-sm font-medium flex items-center gap-2 mb-1">
              <Wallet size={16} /> Total Balance
            </p>
            <h2 className="text-4xl font-bold text-white tracking-tight">
              <span className="text-2xl text-emerald-200 pr-1">৳</span>
              {balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <div className="mt-6 flex gap-3">
              <button className="flex-1 bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-md border border-white/10 text-white py-2.5 rounded-xl text-sm font-semibold shadow-sm">
                Deposit
              </button>
              <button className="flex-1 bg-black/20 hover:bg-black/30 transition-colors backdrop-blur-md border border-white/5 text-white py-2.5 rounded-xl text-sm font-semibold shadow-sm">
                Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Animated Offer Banner */}
        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/20 p-4 rounded-2xl mb-8 backdrop-blur-md flex items-start gap-3">
          <div className="bg-purple-500/20 p-2 rounded-lg">
            <Zap size={20} className="text-purple-400 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-purple-300 text-sm mb-1">Special Bonus Active!</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Deposit ৳5000+ today and instantly receive a <span className="text-emerald-400 font-bold">5% cashback</span> in your wallet.</p>
          </div>
        </div>

        {/* Investment Plans Section */}
        <div className="flex justify-between items-end mb-5">
          <h2 className="text-lg font-bold text-white tracking-wide">Premium Plans</h2>
          <span className="text-xs font-medium text-emerald-400 flex items-center cursor-pointer hover:text-emerald-300 transition-colors">
            View All <ChevronRight size={14} />
          </span>
        </div>
        
        {fetchingPlans ? (
          <div className="flex flex-col items-center justify-center py-12 bg-slate-900/30 rounded-2xl border border-slate-800">
            <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-slate-500 font-medium">Syncing live data...</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="flex flex-col items-center text-center py-12 px-6 bg-slate-900/40 rounded-3xl border border-slate-800 backdrop-blur-sm">
            <AlertCircle size={32} className="text-slate-600 mb-3" />
            <h3 className="text-slate-300 font-semibold mb-1">No Active Plans</h3>
            <p className="text-xs text-slate-500">Wait for the admin to launch new solar investment packages.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {plans.map((plan) => (
              <div key={plan.id} className="group relative bg-slate-800/40 hover:bg-slate-800/80 backdrop-blur-md border border-slate-700/50 hover:border-emerald-500/50 p-5 rounded-2xl transition-all duration-300 overflow-hidden">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h3 className="font-bold text-lg text-white mb-1">{plan.name}</h3>
                    <div className="flex flex-col gap-1 mt-3">
                      <p className="text-sm text-slate-400 flex items-center gap-2">
                        <TrendingUp size={14} className="text-emerald-400" />
                        Daily Return: <span className="text-emerald-400 font-bold">৳{plan.daily}</span>
                      </p>
                      <p className="text-xs text-slate-500">Validity: {plan.validity} Days</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col justify-between h-full">
                    <p className="font-extrabold text-white text-xl mb-3">৳{plan.price}</p>
                    <button 
                      onClick={() => handleBuyPlan(plan)}
                      disabled={loadingPlan === plan.id}
                      className="relative overflow-hidden bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2 text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none"
                    >
                      {loadingPlan === plan.id ? 'Processing...' : 'Invest Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;