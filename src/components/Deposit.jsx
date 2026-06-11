import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { sendTelegramMessage } from '../telegram';

const Deposit = () => {
  const [method, setMethod] = useState('Nagad');
  const [amount, setAmount] = useState('');
  const [trxId, setTrxId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ১. ফায়ারবেস ডাটাবেসে সেভ করা
      const docRef = await addDoc(collection(db, 'deposits'), {
        userId: "user_123", // পরবর্তীতে Auth থেকে ডাইনামিক হবে
        method: method,
        amount: Number(amount),
        trxId: trxId,
        status: 'Pending',
        timestamp: serverTimestamp()
      });

      // ২. টেলিগ্রামে নোটিফিকেশন পাঠানো
      const message = `<b>🔔 New Deposit Request!</b>\n\n<b>Method:</b> ${method}\n<b>Amount:</b> ৳${amount}\n<b>TrxID:</b> ${trxId}\n<b>Status:</b> Pending\n\nCheck Admin Panel to Approve.`;
      await sendTelegramMessage(message);

      alert('Deposit Request Submitted Successfully!');
      setAmount('');
      setTrxId('');
    } catch (error) {
      console.error("Error adding document: ", error);
      alert('Failed to submit. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-400">Add Money</h2>
      
      <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 mb-6">
        <p className="text-sm text-gray-400 mb-2">Send money to our official number:</p>
        <div className="mb-2 text-lg"><strong>Nagad (Personal):</strong> +8801875907416</div>
        {/* Binance option removed for now, you can add it here later */}
      </div>

      <form onSubmit={handleDepositSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-300">Payment Method</label>
          <select 
            value={method} 
            onChange={(e) => setMethod(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
          >
            <option value="Nagad">Nagad</option>
            {/* Binance option from dropdown removed for now */}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-gray-300">Amount (৳)</label>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500"
            placeholder="e.g., 1000"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-300">Transaction ID (TrxID)</label>
          <input 
            type="text" 
            value={trxId}
            onChange={(e) => setTrxId(e.target.value)}
            required
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500"
            placeholder="e.g., 8A9BXXXZ"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-lg mt-4 transition"
        >
          {loading ? 'Submitting...' : 'Submit Deposit'}
        </button>
      </form>
    </div>
  );
};

export default Deposit;