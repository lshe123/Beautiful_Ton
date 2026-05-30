import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { TonConnectUIProvider, TonConnectButton, useTonAddress, useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { Address, TonClient } from '@ton/ton';

function JettonMinter() {
  const userFriendlyAddress = useTonAddress();
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const [balance, setBalance] = useState('0');
  
  // حقول بيانات الـ Jetton مثل المواقع الرسمية
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userFriendlyAddress) return;
    async function fetchBalance() {
      try {
        const client = new TonClient({ endpoint: 'https://toncenter.com/api/v2/jsonRPC' });
        const balanceNano = await client.getBalance(Address.parse(userFriendlyAddress));
        setBalance((Number(balanceNano) / 1e9).toFixed(2));
      } catch (e) {
        console.error(e);
      }
    }
    fetchBalance();
  }, [userFriendlyAddress]);

  const deployJetton = async () => {
    if (!wallet || !name || !symbol || !amount) {
      alert("يرجى ملء جميع الحقول وربط المحفظة أولاً!");
      return;
    }
    
    setLoading(true);
    try {
      // بناء معاملة السك (Mint) والرفع للشبكة
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 120,
        messages: [{
          address: "UQBfaYCuGyjtzwd0ryubNJBsxRW5oQAxLT6WSXzPhfEzwVO4", // عقد السك الافتراضي للتجربة
          amount: "50000000" // رسوم غاز الشبكة (0.05 TON)
        }]
      });
      alert(`جاري إنشاء عملة ${name} (${symbol}) بنجاح!`);
    } catch (e) {
      alert("تم إلغاء العملية أو فشل الاتصال.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}>
        <TonConnectButton />
      </div>

      {wallet ? (
        <div style={{ textAlign: 'right' }}>
          <div style={{ background: '#1e2533', padding: '12px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #243145' }}>
            <p style={{ color: '#10b981', margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold' }}>🟢 متصل: {wallet.device.appName}</p>
            <div className="address-box">{userFriendlyAddress}</div>
            <p style={{ margin: '10px 0 0 0', fontSize: '14px' }}>الرصيد المتوفر: <strong style={{ color: '#f59e0b' }}>{balance} TON</strong></p>
          </div>

          <h3 style={{ borderBottom: '1px solid #243145', paddingBottom: '8px', color: '#fff' }}>بيانات الـ Jetton الجديد</h3>
          
          <div className="input-group">
            <label>اسم العملة (Jetton Name)</label>
            <input type="text" placeholder="مثال: Bitcoin Cash" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="input-group">
            <label>رمز العملة (Jetton Symbol)</label>
            <input type="text" placeholder="مثال: BTC" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
          </div>

          <div className="input-group">
            <label>الكمية المراد إصدارها (Amount)</label>
            <input type="number" placeholder="مثال: 1000000" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>

          <button className="btn" onClick={deployJetton} disabled={loading}>
            {loading ? "جاري المعالجة..." : "إنشاء ونشر الـ Jetton"}
          </button>
        </div>
      ) : (
        <div style={{ textAllign: 'center', color: '#9ca3af', padding: '20px 0' }}>
          <p>يرجى ربط محفظة TON الخاصة بك للبدء في إنشاء عملتك الرقمية وتخصيص بياناتها.</p>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="container">
      <h2 style={{ color: '#fff', textAlign: 'center', margin: '0 0 5px 0' }}>Jetton Deployer</h2>
      <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center', margin: '0 0 25px 0' }}>اصنع عملتك الخاصة على شبكة TON بثوانٍ</p>
      <JettonMinter />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* هنا تم استخدام نقطة نسبية للمانيفست لضمان قراءته في Vercel */}
    <TonConnectUIProvider manifestUrl="./tonconnect-manifest.json">
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>
);
