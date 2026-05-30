import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { TonConnectUIProvider, TonConnectButton, useTonAddress, useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { Address, TonClient } from '@ton/ton';

function App() {
  const userFriendlyAddress = useTonAddress();
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    if (!userFriendlyAddress) return;
    async function fetchBalance() {
      try {
        const client = new TonClient({ endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC' });
        const balanceNano = await client.getBalance(Address.parse(userFriendlyAddress));
        setBalance((Number(balanceNano) / 1e9).toFixed(2));
      } catch (e) { console.error(e); }
    }
    fetchBalance();
  }, [userFriendlyAddress]);

  const sendTx = async () => {
    if (!wallet) return;
    try {
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [{ address: "UQBfaYCuGyjtzwd0ryubNJBsxRW5oQAxLT6WSXzPhfEzwVO4", amount: "100000000" }]
      });
      alert("تم طلب المعاملة!");
    } catch (e) { alert("ألغيت المعاملة"); }
  };

  return (
    <div className="card">
      <h2>منصة الـ Jettons الذكية</h2>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <TonConnectButton />
      </div>

      {wallet ? (
        <div style={{ textAlign: 'right', marginTop: '15px' }}>
          <p style={{ color: '#4ade80' }}>🟢 متصل: {wallet.device.appName}</p>
          <p>العنوان:</p>
          <div className="address">{userFriendlyAddress}</div>
          <p>الرصيد: <strong style={{ color: '#fbbf24' }}>{balance} TON</strong></p>
          <button className="btn" onClick={sendTx}>إرسال 0.1 TON</button>
        </div>
      ) : (
        <p style={{ color: '#94a3b8' }}>المحفظة غير متصلة. اضغط زر الربط.</p>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl="https://your-domain.com/tonconnect-manifest.json">
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>
);
