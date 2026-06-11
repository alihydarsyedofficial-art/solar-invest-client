import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';

const Home = () => {
  const [balance, setBalance] = useState(0);
  const [userUid, setUserUid] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(null); 
  
  // নতুন স্টেট: ফায়ারবেস থেকে প্ল্যানগুলো স্টোর করার জন্য
  const [plans, setPlans] = useState([]);
  const [fetchingPlans, setFetchingPlans] = useState(true);

  // ১. কম্পোনেন্ট লোড হলে ইউজারের রিয়েল ব্যালেন্স নিয়ে আসা
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

  // ২. ফায়ারবেস ডাটাবেস থেকে রিয়েল সোলার প্ল্যানগুলো নিয়ে আসা
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

  // ৩. প্ল্যান কেনার ফাংশন
  const handleBuyPlan = async (plan) => {
    if (!userUid) return alert('Please login first!');
    
    setLoadingPlan(plan.id);

    try {
      const userDocRef = doc(db, 'users', userUid);
      const userSnap = await getDoc(userDocRef);
      
      if (!userSnap.exists()) {
        alert("User account not found!");
        setLoadingPlan(null);
        return;
      }

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
    <div className="text-white p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-green-400">Solar Invest</h1>
          <p className="text-xs text-gray-400">Invest in green energy!</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-xl text-center shadow-lg">
          <p className="text-xs text-gray-400">Main Balance</p>
          <p className="text-lg font-bold text-yellow-400">৳ {balance.toFixed(2)}</p>
        </div>
      </div>

      {/* Notice Board */}
      <div className="bg-gradient-to-r from-green-600 to-green-400 p-4 rounded-xl mb-6 shadow-lg">
        <h3 className="font-bold text-white mb-1">📢 Special Offer!</h3>
        <p className="text-sm text-green-100">Deposit ৳5000 and get a 5% instant bonus. Valid till tomorrow.</p>
      </div>

      {/* Solar Plans Section */}
      <h2 className="text-xl font-bold mb-4">Investment Plans</h2>
      
      {fetchingPlans ? (
        <div className="text-center text-gray-400 py-10">Loading plans...</div>
      ) : plans.length === 0 ? (
        <div className="text-center text-gray-400 py-10">No investment plans available right now.</div>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex justify-between items-center hover:border-green-500 transition-colors">
              <div>
                <h3 className="font-bold text-lg text-white">{plan.name}</h3>
                <p className="text-sm text-gray-400">Daily Return: <span className="text-green-400 font-bold">৳{plan.daily}</span></p>
                <p className="text-xs text-gray-500 mt-1">Validity: {plan.validity} Days</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-yellow-400 mb-2 text-lg">৳{plan.price}</p>
                <button 
                  onClick={() => handleBuyPlan(plan)}
                  disabled={loadingPlan === plan.id}
                  className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 text-sm font-bold rounded-lg transition shadow-md disabled:bg-gray-500"
                >
                  {loadingPlan === plan.id ? 'Processing...' : 'Buy Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;