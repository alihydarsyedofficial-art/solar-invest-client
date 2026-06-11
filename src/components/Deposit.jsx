import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { sendTelegramMessage } from '../telegram';

const Deposit = () => {
  const [amount, setAmount] = useState('');
  const [trxId, setTrxId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return alert("Please login");
    setLoading(true);

    try {
      await addDoc(collection(db, 'deposits'), {
        userId: auth.currentUser.uid, // Dynamic ID
        amount: Number(amount),
        trxId: trxId,
        status: 'Pending',
        timestamp: serverTimestamp()
      });
      await sendTelegramMessage(`New Deposit: ৳${amount}`);
      alert('Request Submitted!');
      setAmount(''); setTrxId('');
    } catch (error) {
      alert('Failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Money</h2>
      <form onSubmit={handleDepositSubmit} className="space-y-4">
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="Amount" className="w-full p-3 bg-gray-800 rounded-lg" />
        <input type="text" value={trxId} onChange={(e) => setTrxId(e.target.value)} required placeholder="TrxID" className="w-full p-3 bg-gray-800 rounded-lg" />
        <button type="submit" disabled={loading} className="w-full bg-green-500 py-3 rounded-lg font-bold">Submit</button>
      </form>
    </div>
  );
};

export default Deposit;