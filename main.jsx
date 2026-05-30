import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { TonConnectUIProvider, TonConnectButton, useTonAddress, useTonWallet } from '@tonconnect/ui-react';
import { Address, TonClient } from '@ton/ton';

function GamesPlatform() {
  const userFriendlyAddress = useTonAddress();
  const wallet = useTonWallet();
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    if (!userFriendlyAddress) return;
    async function fetchBalance() {
      try {
        // تم تصحيح الكود هنا وإرجاعه إلى TonClient بدلاً من Client
        const client = new TonClient({ endpoint: 'https://toncenter.com/api/v2/jsonRPC' });
        const balanceNano = await client.getBalance(Address.parse(userFriendlyAddress));
        setBalance((Number(balanceNano) / 1e9).toFixed(2));
      } catch (e) {
        console.error(e);
      }
    }
    fetchBalance();
  }, [userFriendlyAddress]);

  const playGame = (gameName) => {
    if (!wallet) {
      alert("يرجى ربط محفظتك أولاً لبدء اللعب برصيد TON!");
      return;
    }
    alert(`جاري الاتصال بخادم لعبة ${gameName}... رصيدك الحالي: ${balance} TON`);
  };

  return (
    <div>
      {/* شريط التنقل العلوي */}
      <div className="navbar">
        <div className="logo">Jetton Games</div>
        <TonConnectButton />
      </div>

      {/* قسم الترحيب البصري */}
      <div className="hero">
        <h1>العب واربح باستخدام TON</h1>
        <p>المنصة المفضلة لألعاب الحظ السريعة والعادلة على تليجرام</p>
        
        {wallet && (
          <div style={{ marginTop: '15px', background: 'rgba(0,202,236,0.1)', display: 'inline-block', padding: '10px 20px', borderRadius: '30px', border: '1px solid #00caec' }}>
            رصيدك المتاح: <strong style={{ color: '#00caec' }}>{balance} TON</strong>
          </div>
        )}
      </div>

      {/* شبكة الألعاب مثل موقع Jetton الأصلي */}
      <div className="games-grid">
        <div className="game-card" onClick={() => playGame('Crash')}>
          <div className="game-icon">🚀</div>
          <div className="game-title">Crash</div>
          <div className="game-status">اضرب المضاعف</div>
        </div>

        <div className="game-card" onClick={() => playGame('Mines')}>
          <div className="game-icon">💣</div>
          <div className="game-title">Mines</div>
          <div className="game-status">تجنب القنابل</div>
        </div>

        <div className="game-card" onClick={() => playGame('Roulette')}>
          <div className="game-icon">🎰</div>
          <div className="game-title">Roulette</div>
          <div className="game-status">عجلة الحظ</div>
        </div>

        <div className="game-card" onClick={() => playGame('Dice')}>
          <div className="game-icon">🎲</div>
          <div className="game-title">Dice</div>
          <div className="game-status">توقع الرقم</div>
        </div>
      </div>

      <div className="footer-panel">
        <p>تطبيق Jetton Games تجريبي متصل بشبكة TON البلوكشين</p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl="./tonconnect-manifest.json">
      <GamesPlatform />
    </TonConnectUIProvider>
  </React.StrictMode>
);
