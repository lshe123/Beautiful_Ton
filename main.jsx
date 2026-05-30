import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { TonConnectUIProvider, TonConnectButton, useTonAddress, useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { Address, TonClient } from '@ton/ton';

// نقوم بفصل مكون لوحة التحكم لتجنب تضارب الـ Hooks مع الـ Provider
function Dashboard() {
  const userFriendlyAddress = useTonAddress();
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userFriendlyAddress) return;
    
    async function fetchBalance() {
      setLoading(true);
      try {
        // الاتصال بشبكة TON جيتواي المجانية للتجربة
        const client = new TonClient({ endpoint: 'https://toncenter.com/api/v2/jsonRPC' });
        const balanceNano = await client.getBalance(Address.parse(userFriendlyAddress));
        setBalance((Number(balanceNano) / 1e9).toFixed(2));
      } catch (e) { 
        console.error("خطأ في جلب الرصيد:", e); 
      } finally {
        setLoading(false);
      }
    }
    fetchBalance();
  }, [userFriendlyAddress]);

  const sendTx = async () => {
    if (!wallet) return;
    try {
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [{ 
          address: "UQBfaYCuGyjtzwd0ryubNJBsxRW5oQAxLT6WSXzPhfEzwVO4", // عنوان حقيقي تجريبي للتست
          amount: "100000000" 
        }]
      });
      alert("تم إرسال طلب المعاملة إلى محفظتك!");
    } catch (e) { 
      alert("تم إلغاء المعاملة من قِبل المستخدم"); 
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <TonConnectButton />
      </div>

      {wallet ? (
        <div style={{ textAlign: 'right', marginTop: '15px' }}>
          <p style={{ color: '#4ade80', fontWeight: 'bold' }}>🟢 متصل عبر: {wallet.device.appName}</p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#94a3b8' }}>العنوان الحساب:</p>
          <div className="address">{userFriendlyAddress}</div>
          <p style={{ marginTop: '10px' }}>الرصيد: <strong style={{ color: '#fbbf24' }}>{loading ? "جاري التحديث..." : `${balance} TON`}</strong></p>
          <button className="btn" onClick={sendTx}>إرسال معاملة تجريبية (0.1 TON)</button>
        </div>
      ) : (
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>المحفظة غير متصلة. يرجى الضغط على الزر الأزرق في الأعلى للربط.</p>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="card">
      <h2 style={{ margin: '0 0 10px 0', color: '#fff' }}>منصة الـ Jettons الذكية</h2>
      <Dashboard />
    </div>
  );
}

// تشغيل التطبيق وربطه بملف المانيفست المحلي
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl="http://localhost:3000/tonconnect-manifest.json">
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>
);
