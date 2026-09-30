import { useState, useEffect, useRef } from 'react';
import { 
  CreditCard, 
  Wifi, 
  RefreshCw, 
  CheckCircle, 
  X, 
  ArrowRight, 
  Zap, 
  QrCode, 
  History, 
  ShieldCheck, 
  PlusCircle, 
  Smartphone,
  Check,
  Search,
  User,
  ExternalLink,
  ChevronRight,
  BadgePercent,
  Sparkles,
  Layers,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useI18n } from '../i18nContext';
import { useAuth } from '../context/AuthContext';
import MetroCardVisual from './MetroCardVisual';

const NFC_CSS = `
  @keyframes nfcRipple {
    0% { transform: scale(0.8); opacity: 0.8; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  @keyframes nfcCardFloat {
    0%, 100% { transform: translateY(0px) rotate(-5deg); }
    50% { transform: translateY(-12px) rotate(-5deg); }
  }
  @keyframes nfcSuccess {
    0% { transform: scale(0.5); opacity: 0; }
    60% { transform: scale(1.15); }
    100% { transform: scale(1); opacity: 1; }
  }
  .nfc-ripple { animation: nfcRipple 1.8s ease-out infinite; }
  .nfc-ripple-2 { animation: nfcRipple 1.8s ease-out 0.6s infinite; }
  .nfc-card-float { animation: nfcCardFloat 2.5s ease-in-out infinite; }
  .nfc-success-pop { animation: nfcSuccess 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
`;

const INITIAL_ASSOCIATED_CARDS = [
  {
    id: 'card-1',
    name: 'TuTarjetaMetro Personalizada',
    type: 'Personalizada Metro L1 / Tullave',
    number: '1000-0124-9876-5432',
    holder: 'Ciudadano Metro',
    cedula: '1.020.893.421',
    balance: 24500,
    tag: 'Principal',
    tagColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    status: 'Activa · Con Subsidio Sisbén',
    isPrimary: true
  },
  {
    id: 'card-2',
    name: 'TuLlave Básica / Intermodal',
    type: 'Básica Sin Personalizar',
    number: '1000-8841-2309-1145',
    holder: 'Tarjeta Secundaria',
    cedula: '1.020.893.421',
    balance: 8200,
    tag: 'Secundaria',
    tagColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    status: 'Activa · Tarifa Plena',
    isPrimary: false
  },
  {
    id: 'card-3',
    name: 'TuTarjetaMetro Preferencial',
    type: 'Tarifa Diferencial Estudiante',
    number: '1000-5591-7230-9081',
    holder: 'Estudiante Distrital',
    cedula: '1.031.456.789',
    balance: 14700,
    tag: 'Estudiantil',
    tagColor: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    status: 'Activa · Tarifa Preferencial $2.500',
    isPrimary: false
  }
];

const INITIAL_HISTORY = [
  { id: 'h1', type: 'trip', title: 'Viaje Metro L1 · E12 Av. Jiménez', date: '27 Ago 2026, 14:15', amount: '-$3.300', icon: '🚆', color: 'text-red-500' },
  { id: 'h2', type: 'recharge', title: 'Recarga PSE Nequi', date: '26 Ago 2026, 08:30', amount: '+$30.000', icon: '💳', color: 'text-green-500' },
  { id: 'h3', type: 'trip', title: 'TransMilenio · Portal Américas', date: '25 Ago 2026, 17:42', amount: '-$2.950', icon: '🚌', color: 'text-red-500' },
  { id: 'h4', type: 'trip', title: 'Transbordo SITP · Cl 72', date: '25 Ago 2026, 18:20', amount: '$0', icon: '🔄', color: 'text-zinc-500' },
];

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1-').replace(/-$/, '');
}

function formatCedula(value) {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, digits.length - 6)}.${digits.slice(-6, -3)}.${digits.slice(-3)}`;
  return `${digits.slice(0, 1)}.${digits.slice(1, 4)}.${digits.slice(4, 7)}.${digits.slice(7)}`;
}

export default function SaldoCard({ dark, onClose }) {
  const { t } = useI18n();
  const { userProfile, updateSaldo } = useAuth();
  
  // Navigation / Tabs within module
  const [activeTab, setActiveTab] = useState('consulta'); // 'consulta' | 'recarga' | 'nfc' | 'qr' | 'historial'
  
  // Associated cards list
  const [associatedCards, setAssociatedCards] = useState(() => {
    try {
      const stored = localStorage.getItem('urbango_associated_cards');
      return stored ? JSON.parse(stored) : INITIAL_ASSOCIATED_CARDS;
    } catch {
      return INITIAL_ASSOCIATED_CARDS;
    }
  });

  const [selectedCardId, setSelectedCardId] = useState(() => {
    return associatedCards[0]?.id || 'card-1';
  });

  // Query mode: 'card' or 'cedula'
  const [queryMode, setQueryMode] = useState('card'); // 'card' | 'cedula'
  const [cardNum, setCardNum] = useState(() => {
    return localStorage.getItem('urbango_tullave_card') || '1000-0124-9876-5432';
  });
  const [cedulaInput, setCedulaInput] = useState(() => {
    return localStorage.getItem('urbango_tullave_cedula') || '1.020.893.421';
  });

  // Current active card balance and holder
  const [balance, setBalance] = useState(() => {
    if (typeof userProfile?.saldo === 'number') return userProfile.saldo;
    const stored = localStorage.getItem('urbango_tullave_balance');
    return stored ? Number(stored) : 24500;
  });
  
  const [cardHolder, setCardHolder] = useState(() => {
    return userProfile?.name || localStorage.getItem('urbango_tullave_holder') || 'Ciudadano Metro';
  });

  const [cardType, setCardType] = useState('Personalizada Tullave / Metro L1');
  const [isEditingHolder, setIsEditingHolder] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Modal for adding a new card
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [newCardName, setNewCardName] = useState('');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardCedula, setNewCardCedula] = useState('');

  // Consultation State
  const [consultLoading, setConsultLoading] = useState(false);
  const [consultResult, setConsultResult] = useState(() => {
    return {
      success: true,
      cardNum: '1000-0124-9876-5432',
      holder: 'Ciudadano Metro',
      cedula: '1.020.893.421',
      balance: 24500,
      status: 'Activa y Operativa',
      subsidio: 'Sisbén Nivel A/B Acreditado',
      transbordo: 'Activo ($0 COP ventana 110 min)',
      creditoEmergencia: '2 viajes autorizados ($6.600)',
      tripsMetro: Math.floor(24500 / 3300),
      tripsTM: Math.floor(24500 / 2950),
      timestamp: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  });

  // Recharge state
  const [rechargeAmount, setRechargeAmount] = useState(20000);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('nequi'); // 'nequi' | 'daviplata' | 'pse' | 'card'
  const [isRecharging, setIsRecharging] = useState(false);
  const [rechargeSuccess, setRechargeSuccess] = useState(null);
  
  // History state
  const [history, setHistory] = useState(INITIAL_HISTORY);

  // NFC states
  const [nfcStatus, setNfcStatus] = useState('idle');
  const [nfcSupported, setNfcSupported] = useState(false);
  const nfcReaderRef = useRef(null);

  const rechargeRef = useRef(null);

  useEffect(() => {
    setNfcSupported('NDEFReader' in window);
  }, []);

  // Sync profile balance if available
  useEffect(() => {
    if (typeof userProfile?.saldo === 'number') {
      setBalance(userProfile.saldo);
    }
  }, [userProfile?.saldo]);

  // Persist associated cards
  const saveAssociatedCards = (cards) => {
    setAssociatedCards(cards);
    localStorage.setItem('urbango_associated_cards', JSON.stringify(cards));
  };

  // Select an associated card
  const handleSelectCard = (card) => {
    setSelectedCardId(card.id);
    setCardNum(card.number);
    setBalance(card.balance);
    setCardHolder(card.holder);
    setCardType(card.type);
    if (card.cedula) setCedulaInput(card.cedula);

    localStorage.setItem('urbango_tullave_card', card.number);
    localStorage.setItem('urbango_tullave_holder', card.holder);
    localStorage.setItem('urbango_tullave_balance', String(card.balance));

    // Update consultation result preview
    setConsultResult({
      success: true,
      cardNum: card.number,
      holder: card.holder,
      cedula: card.cedula || 'No registrada',
      balance: card.balance,
      status: card.status || 'Activa y Operativa',
      subsidio: card.cedula ? 'Subsidio Distrital Verificado' : 'Tarifa Plena',
      transbordo: 'Activo ($0 COP ventana 110 min)',
      creditoEmergencia: '2 viajes autorizados',
      tripsMetro: Math.floor(card.balance / 3300),
      tripsTM: Math.floor(card.balance / 2950),
      timestamp: 'Actualizado hace un momento'
    });
  };

  // Add new card handler
  const handleAddNewCard = (e) => {
    e.preventDefault();
    const cleanDigits = newCardNumber.replace(/\D/g, '');
    if (cleanDigits.length < 16) return;

    const formatted = formatCardNumber(cleanDigits);
    const newCard = {
      id: `card-${Date.now()}`,
      name: newCardName.trim() || 'TuTarjetaMetro Adicional',
      type: 'Personalizada Metro / Tullave',
      number: formatted,
      holder: cardHolder,
      cedula: newCardCedula.trim() || cedulaInput,
      balance: 10000,
      tag: 'Asociada',
      tagColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      status: 'Activa y Operativa',
      isPrimary: false
    };

    const updated = [...associatedCards, newCard];
    saveAssociatedCards(updated);
    handleSelectCard(newCard);
    setIsAddCardOpen(false);
    setNewCardName('');
    setNewCardNumber('');
    setNewCardCedula('');
  };

  const handleCardNumChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNum(formatted);
    localStorage.setItem('urbango_tullave_card', formatted);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleCedulaChange = (e) => {
    const formatted = formatCedula(e.target.value);
    setCedulaInput(formatted);
    localStorage.setItem('urbango_tullave_cedula', formatted);
  };

  // PROMINENT CONSULTATION HANDLER
  const handleConsultBalance = () => {
    setConsultLoading(true);
    setConsultResult(null);

    setTimeout(() => {
      setConsultLoading(false);
      
      // If querying by cedula, check if an associated card matches
      let matchingCard = null;
      if (queryMode === 'cedula') {
        const cleanCed = cedulaInput.replace(/\D/g, '');
        matchingCard = associatedCards.find(c => c.cedula.replace(/\D/g, '') === cleanCed) || associatedCards[0];
      } else {
        const cleanNum = cardNum.replace(/\D/g, '');
        matchingCard = associatedCards.find(c => c.number.replace(/\D/g, '') === cleanNum) || {
          number: cardNum,
          holder: cardHolder,
          cedula: cedulaInput,
          balance: balance,
          type: cardType,
          status: 'Activa y Operativa'
        };
      }

      const activeBal = matchingCard.balance || balance;
      setBalance(activeBal);
      if (matchingCard.number) setCardNum(matchingCard.number);
      if (matchingCard.holder) setCardHolder(matchingCard.holder);

      setConsultResult({
        success: true,
        cardNum: matchingCard.number || cardNum,
        holder: matchingCard.holder || cardHolder,
        cedula: matchingCard.cedula || cedulaInput || '1.020.893.421',
        balance: activeBal,
        status: 'Activa y Operativa · Conexión SIRCI OK',
        subsidio: 'Subsidio Sisbén A/B Aplicado ($2.500 COP Metro)',
        transbordo: 'Activo ($0 COP ventana 110 min)',
        creditoEmergencia: '2 viajes autorizados ($6.600)',
        tripsMetro: Math.max(0, Math.floor(activeBal / 3300)),
        tripsTM: Math.max(0, Math.floor(activeBal / 2950)),
        timestamp: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
    }, 850);
  };

  // Fast switch to direct recharge flow
  const handleGoToRecharge = () => {
    setActiveTab('recarga');
    if (rechargeRef.current) {
      rechargeRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Execute recharge simulation
  const handleExecuteRecharge = () => {
    const amountToCharge = customAmount ? parseInt(customAmount.replace(/\D/g, ''), 10) : rechargeAmount;
    if (!amountToCharge || amountToCharge < 2000) return;

    setIsRecharging(true);
    setTimeout(() => {
      setIsRecharging(false);
      const newBal = balance + amountToCharge;
      setBalance(newBal);
      updateSaldo?.(newBal);
      localStorage.setItem('urbango_tullave_balance', String(newBal));

      // Update in associated cards list
      const updatedCards = associatedCards.map(c => 
        c.number === cardNum ? { ...c, balance: newBal } : c
      );
      saveAssociatedCards(updatedCards);

      const receiptId = `TUL-${Math.floor(100000 + Math.random() * 900000)}`;
      const nowStr = `${new Date().getDate()} Ago 2026, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      
      const newReceipt = {
        id: receiptId,
        amount: amountToCharge,
        method: paymentMethod.toUpperCase(),
        date: nowStr,
        newBalance: newBal
      };
      
      setRechargeSuccess(newReceipt);
      setHistory(prev => [
        {
          id: receiptId,
          type: 'recharge',
          title: `Recarga ${paymentMethod.toUpperCase()}`,
          date: nowStr,
          amount: `+$${amountToCharge.toLocaleString('es-CO')}`,
          icon: '💳',
          color: 'text-green-500'
        },
        ...prev
      ]);

      // Update consultation result if present
      if (consultResult) {
        setConsultResult(prev => ({
          ...prev,
          balance: newBal,
          tripsMetro: Math.floor(newBal / 3300),
          tripsTM: Math.floor(newBal / 2950),
          timestamp: 'Recién acreditado · ' + nowStr
        }));
      }
    }, 1200);
  };

  const handleNFCRead = async () => {
    if (nfcSupported) {
      try {
        setNfcStatus('reading');
        const ndef = new window.NDEFReader();
        nfcReaderRef.current = ndef;
        await ndef.scan();
        ndef.addEventListener('reading', () => {
          if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
          setNfcStatus('success');
        });
      } catch (err) {
        setNfcStatus('unsupported');
      }
    } else {
      setNfcStatus('reading');
      setTimeout(() => {
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        setNfcStatus('success');
      }, 1600);
    }
  };

  const resetNFC = () => {
    setNfcStatus('idle');
    if (nfcReaderRef.current) {
      try { nfcReaderRef.current.stop?.(); } catch (_) {}
    }
  };

  const cleanDigits = cardNum.replace(/\D/g, '');
  const isCardValid = cleanDigits.length === 16;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto pb-16 md:pb-8">
      <style>{NFC_CSS}</style>

      {/* ── ENCABEZADO OFICIAL CON BOTÓN DE RETORNO / CIERRE ── */}
      <div className={`p-4 sm:p-5 rounded-3xl border flex items-center justify-between shadow-sm transition-all ${
        dark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-zinc-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-yellow-400 text-zinc-950 flex items-center justify-center font-black shadow-lg shadow-yellow-500/20 shrink-0">
            <CreditCard size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className={`text-[10px] font-black uppercase tracking-widest ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {t('cardBalanceModal.subtitle', 'Ingresa los datos de tu tarjeta para consultar tu saldo en tiempo real.')}
              </span>
            </div>
            <h2 className={`text-xl sm:text-2xl font-black italic tracking-tighter ${dark ? 'text-white' : 'text-zinc-900'}`}>
              {t('cardBalanceModal.title', 'Consulta de Saldo - TuTarjetaMetro / TuLlave')}
            </h2>
          </div>
        </div>

        {onClose && (
          <button 
            onClick={onClose} 
            className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-all active:scale-95 ${
              dark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900'
            }`}
            title="Cerrar y volver al inicio"
            aria-label="Cerrar modal de saldo"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* ── TARJETA VISUAL 3D INTERACTIVA ── */}
      <div className="relative">
        <MetroCardVisual
          cardNumber={cardNum}
          cardHolder={cardHolder}
          balance={balance}
          cardType={cardType}
          dark={dark}
          onRechargeClick={handleGoToRecharge}
        />

        {/* CINTA RÁPIDA DE SALDO Y ACCESO DIRECTO A RECARGA */}
        <div className={`mt-3 p-3.5 sm:p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md ${
          dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
        }`}>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg font-black shrink-0">
              💰
            </div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-wider ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {t('cardBalanceModal.currentBalance', 'Saldo Disponible:')}
              </p>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-black tracking-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
                  ${balance.toLocaleString('es-CO')}
                </span>
                <span className="text-xs font-bold text-emerald-500">COP</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleGoToRecharge}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#B30000] hover:bg-[#8e0000] text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Zap size={14} />
              <span>{t('cardBalanceModal.btnRecharge', 'Recargar en Línea')}</span>
            </button>
            <button
              onClick={handleConsultBalance}
              className={`p-2.5 rounded-xl border font-bold text-xs transition-all active:scale-95 flex items-center justify-center ${
                dark ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-zinc-900'
              }`}
              title="Refrescar saldo"
            >
              <RefreshCw size={15} className={consultLoading ? 'animate-spin text-[#B30000]' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* ── SELECTOR PRINCIPAL DE PESTAÑAS DEL MÓDULO ── */}
      <div className={`flex p-1.5 rounded-2xl border ${dark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
        {[
          { key: 'consulta', label: t('cardBalanceModal.btnConsult', 'Consultar Saldo'), icon: <Search size={14} /> },
          { key: 'recarga',  label: t('cardBalanceModal.btnRecharge', 'Recargar en Línea'), icon: <Zap size={14} /> },
          { key: 'nfc',      label: t('saldoCard.tabNfc', 'Lector NFC'),      icon: <Wifi size={14} /> },
          { key: 'qr',       label: t('saldoCard.qrBoarding', 'Boleto QR Metro'), icon: <QrCode size={14} /> },
          { key: 'historial',label: t('saldoCard.tabMovements', 'Movimientos'),     icon: <History size={14} /> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setRechargeSuccess(null); resetNFC(); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-[#B30000] text-white shadow-md'
                : dark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ── PESTAÑA 1: MÓDULO DE CONSULTA OFICIAL Y TARJETAS ASOCIADAS ── */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'consulta' && (
        <div className="space-y-5">
          
          {/* 1. SECCIÓN DE TARJETAS ASOCIADAS */}
          <div className={`p-4 sm:p-5 rounded-3xl border shadow-sm transition-all ${
            dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-[#B30000]" />
                <h3 className={`text-xs sm:text-sm font-black uppercase tracking-wider ${dark ? 'text-white' : 'text-zinc-900'}`}>
                  {t('saldoCard.associatedCards', 'Tarjetas Asociadas')} ({associatedCards.length})
                </h3>
              </div>
              <button
                onClick={() => setIsAddCardOpen(true)}
                className="text-[10px] font-black uppercase tracking-wider text-[#B30000] hover:underline flex items-center gap-1"
              >
                <PlusCircle size={12} />
                <span>{t('saldoCard.associateNewCard', 'Asociar Nueva')}</span>
              </button>
            </div>

            {/* Carrusel de tarjetas asociadas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {associatedCards.map(c => {
                const isSelected = c.id === selectedCardId;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleSelectCard(c)}
                    className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                      isSelected
                        ? 'border-[#B30000] ring-2 ring-[#B30000]/20 bg-red-950/10 shadow-sm'
                        : dark 
                          ? 'bg-zinc-800/50 border-zinc-700/60 hover:border-zinc-500' 
                          : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${c.tagColor}`}>
                        {c.tag}
                      </span>
                      {isSelected && (
                        <CheckCircle2 size={13} className="text-[#B30000]" />
                      )}
                    </div>
                    <p className={`text-xs font-black truncate ${dark ? 'text-white' : 'text-zinc-900'}`}>
                      {c.name}
                    </p>
                    <p className="font-mono text-[10px] font-semibold text-zinc-500 mt-0.5">
                      •••• {c.number.slice(-4)}
                    </p>
                    <div className="mt-2 pt-2 border-t border-zinc-200/40 dark:border-zinc-700/40 flex items-center justify-between">
                      <span className={`text-[9px] font-bold ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>{t('saldoCard.currentBalance', 'Saldo:')}</span>
                      <span className="text-xs font-black text-[#B30000]">
                        ${c.balance.toLocaleString('es-CO')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. FORMULARIO DE CONSULTA: INGRESO POR TARJETA O POR CÉDULA */}
          <div className={`p-5 sm:p-6 rounded-3xl border shadow-sm space-y-4 transition-all ${
            dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-zinc-200 dark:border-zinc-800">
              <label className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${
                dark ? 'text-white' : 'text-zinc-900'
              }`}>
                <span>{t('saldoCard.queryTitle', 'Consultar Saldo en Red Metro')}</span>
              </label>

              {/* Selector de modo de consulta: Tarjeta vs Cédula */}
              <div className={`flex p-1 rounded-xl border text-[9px] font-black uppercase tracking-wider ${
                dark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-100 border-zinc-200'
              }`}>
                <button
                  type="button"
                  onClick={() => setQueryMode('card')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    queryMode === 'card' 
                      ? 'bg-[#B30000] text-white shadow-sm' 
                      : dark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {t('saldoCard.cardMode', 'N.° Tarjeta')}
                </button>
                <button
                  type="button"
                  onClick={() => setQueryMode('cedula')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    queryMode === 'cedula' 
                      ? 'bg-[#B30000] text-white shadow-sm' 
                      : dark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {t('saldoCard.cedulaMode', 'Cédula (C.C.)')}
                </button>
              </div>
            </div>

            {/* INPUT DINÁMICO SEGÚN MODO */}
            {queryMode === 'card' ? (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {t('cardBalanceModal.inputLabel', 'Número de Tarjeta o Cédula:')}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    isCardValid 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : dark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {cleanDigits.length}/16 dígitos {isCardValid && '✓'}
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <CreditCard size={18} />
                  </div>
                  <input
                    type="text"
                    value={cardNum}
                    onChange={handleCardNumChange}
                    placeholder={t('cardBalanceModal.inputPlaceholder', 'Ej. 1012345678')}
                    maxLength={19}
                    className={`w-full pl-11 pr-10 py-3 rounded-2xl border font-mono text-sm sm:text-base font-black tracking-widest outline-none transition-all ${
                      dark 
                        ? 'bg-zinc-950 border-zinc-700 text-white focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/20' 
                        : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/20'
                    }`}
                  />
                  {cardNum && (
                    <button
                      type="button"
                      onClick={() => setCardNum('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
                      title="Borrar número"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {t('cardBalanceModal.inputLabel', 'Número de Tarjeta o Cédula:')}
                  </span>
                  <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {t('saldoCard.cedulaBadge', 'Documento Nacional C.C.')}
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={cedulaInput}
                    onChange={handleCedulaChange}
                    placeholder={t('cardBalanceModal.inputPlaceholder', 'Ej. 1012345678')}
                    maxLength={14}
                    className={`w-full pl-11 pr-10 py-3 rounded-2xl border font-mono text-sm sm:text-base font-black tracking-widest outline-none transition-all ${
                      dark 
                        ? 'bg-zinc-950 border-zinc-700 text-white focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/20' 
                        : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/20'
                    }`}
                  />
                  {cedulaInput && (
                    <button
                      type="button"
                      onClick={() => setCedulaInput('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
                      title="Borrar documento"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* BOTÓN PROMINENTE: CONSULTAR SALDO */}
            <button
              onClick={handleConsultBalance}
              disabled={consultLoading || (queryMode === 'card' && cleanDigits.length < 8) || (queryMode === 'cedula' && cedulaInput.length < 4)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-zinc-950 font-black text-sm uppercase tracking-widest shadow-xl shadow-yellow-500/20 active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {consultLoading ? (
                <>
                  <RefreshCw size={18} className="animate-spin text-zinc-950" />
                  <span>{t('saldoCard.consultingServers', 'Consultando en Servidores Metro...')}</span>
                </>
              ) : (
                <>
                  <Search size={18} className="text-zinc-950 stroke-[2.5]" />
                  <span>{t('cardBalanceModal.btnConsult', 'Consultar Saldo')}</span>
                </>
              )}
            </button>
          </div>

          {/* 3. MUESTRA VISUAL DEL SALDO DISPONIBLE Y CERTIFICADO OFICIAL */}
          {consultResult && (
            <div className={`p-5 sm:p-6 rounded-3xl border shadow-lg space-y-4 animate-in fade-in slide-in-from-top-3 duration-300 ${
              dark ? 'bg-zinc-900/90 border-emerald-500/40 ring-1 ring-emerald-500/20' : 'bg-white border-emerald-500/40 ring-1 ring-emerald-500/10'
            }`}>
              {/* Header de verificación */}
              <div className="flex items-center justify-between border-b pb-3 border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500 block">
                      {t('saldoCard.verifiedOfficial', 'Consulta Verificada Oficialmente')}
                    </span>
                    <span className={`text-[9px] font-bold ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {consultResult.timestamp}
                    </span>
                  </div>
                </div>

                <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {consultResult.status}
                </span>
              </div>

              {/* Saldo y viajes calculados */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                dark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {t('saldoCard.totalAvailableBalance', 'Saldo Total Disponible')}
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl sm:text-4xl font-black tracking-tight text-[#B30000]">
                      ${consultResult.balance.toLocaleString('es-CO')}
                    </span>
                    <span className="text-xs font-black text-zinc-400 uppercase">COP</span>
                  </div>
                  <p className="text-[10px] font-bold text-zinc-500 mt-1">
                    {t('saldoCard.holder', 'Titular:')} <strong className={dark ? 'text-zinc-300' : 'text-zinc-700'}>{consultResult.holder}</strong> · {t('saldoCard.card', 'Tarjeta:')} <span className="font-mono text-zinc-400">{consultResult.cardNum}</span>
                  </p>
                </div>

                {/* Métricas de viajes */}
                <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
                  <div className={`p-2.5 rounded-xl border text-center ${dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                    <span className="text-sm">🚆</span>
                    <p className={`text-base font-black ${dark ? 'text-white' : 'text-zinc-900'}`}>{consultResult.tripsMetro}</p>
                    <p className="text-[8px] font-bold uppercase tracking-wider text-zinc-500">{t('saldoCard.tripsMetroL1', 'Viajes Metro L1')}</p>
                  </div>
                  <div className={`p-2.5 rounded-xl border text-center ${dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                    <span className="text-sm">🚌</span>
                    <p className={`text-base font-black ${dark ? 'text-white' : 'text-zinc-900'}`}>{consultResult.tripsTM}</p>
                    <p className="text-[8px] font-bold uppercase tracking-wider text-zinc-500">{t('saldoCard.tripsTM', 'Viajes TM Troncal')}</p>
                  </div>
                </div>
              </div>

              {/* Beneficios y subsidios */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
                <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${dark ? 'bg-zinc-800/40 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'}`}>
                  <BadgePercent size={16} className="text-[#2D8B3C] shrink-0" />
                  <span className="text-[11px] truncate">{consultResult.subsidio}</span>
                </div>
                <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${dark ? 'bg-zinc-800/40 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'}`}>
                  <RefreshCw size={16} className="text-blue-500 shrink-0" />
                  <span className="text-[11px] truncate">{consultResult.transbordo}</span>
                </div>
              </div>

              {/* Botón CTA directo para recargar en línea */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleGoToRecharge}
                  className="flex-1 py-3.5 rounded-2xl bg-[#B30000] hover:bg-[#8e0000] text-white font-black text-xs uppercase tracking-widest shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Zap size={16} />
                  <span>{t('saldoCard.rechargeDirect', 'Recargar en Línea Directa')}</span>
                </button>
                <button
                  onClick={() => setActiveTab('qr')}
                  className={`px-5 py-3.5 rounded-2xl border font-bold text-xs uppercase tracking-wider transition-all ${
                    dark ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-zinc-900'
                  }`}
                >
                  {t('saldoCard.viewQr', 'Ver Código QR')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ── PESTAÑA 2: RECARGA EN LÍNEA DIRECTA (PSE, NEQUI, TARJETAS) ── */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'recarga' && (
        <div ref={rechargeRef} className={`rounded-3xl p-5 sm:p-6 border shadow-sm space-y-5 transition-colors ${
          dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
        }`}>
          {rechargeSuccess ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto text-green-500">
                <CheckCircle size={36} />
              </div>
              <div>
                <h3 className={`font-black text-xl italic ${dark ? 'text-white' : 'text-zinc-900'}`}>
                  {t('saldoCard.rechargeSuccessTitle', '¡Recarga Exitosa y Acreditada!')}
                </h3>
                <p className={`text-xs mt-1 font-bold ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {t('saldoCard.officialReceipt', 'Comprobante Oficial:')} #{rechargeSuccess.id} · {rechargeSuccess.date}
                </p>
              </div>
              <div className={`p-4 rounded-2xl border text-left space-y-2 ${dark ? 'bg-zinc-800/60 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}>
                <div className="flex justify-between text-xs font-bold">
                  <span className={dark ? 'text-zinc-400' : 'text-zinc-500'}>{t('saldoCard.creditedAmount', 'Monto Acreditado:')}</span>
                  <span className="text-[#2D8B3C] font-black">+${rechargeSuccess.amount.toLocaleString('es-CO')} COP</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className={dark ? 'text-zinc-400' : 'text-zinc-500'}>{t('saldoCard.paymentMethod', 'Medio de Pago:')}</span>
                  <span className="font-black text-zinc-300">{rechargeSuccess.method}</span>
                </div>
                <div className="flex justify-between text-xs font-bold pt-2 border-t border-zinc-500/20">
                  <span className={dark ? 'text-zinc-300' : 'text-zinc-700'}>{t('saldoCard.newTotalBalance', 'Nuevo Saldo Total:')}</span>
                  <span className="text-base font-black text-[#B30000]">${rechargeSuccess.newBalance.toLocaleString('es-CO')} COP</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setRechargeSuccess(null)}
                  className="flex-1 py-3.5 rounded-2xl bg-zinc-800 text-white font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
                >
                  {t('saldoCard.doAnotherRecharge', 'Hacer Otra Recarga')}
                </button>
                <button
                  onClick={() => setActiveTab('consulta')}
                  className="px-5 py-3.5 rounded-2xl bg-[#B30000] text-white font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
                >
                  {t('saldoCard.seeBalance', 'Ver Saldo')}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Tarjeta Destino de Recarga */}
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                dark ? 'bg-zinc-800/60 border-zinc-700' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#B30000]/15 flex items-center justify-center text-[#B30000] shrink-0 font-bold text-sm">
                    💳
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[10px] font-black uppercase tracking-wider ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {t('saldoCard.targetCard', 'Tarjeta Destino de Recarga')}
                    </p>
                    <p className="font-mono text-xs font-black tracking-wider text-[#B30000] truncate">
                      {cardNum || '1000-0124-9876-5432'}
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-green-500 bg-green-950/20 px-2 py-0.5 rounded-full border border-green-500/20 shrink-0">
                  {isCardValid ? t('saldoCard.cardValid', 'Válida') : t('saldoCard.cardActive', 'Activa')}
                </span>
              </div>

              {/* Montos Rápidos */}
              <div>
                <label className={`block text-[10px] font-black uppercase tracking-widest mb-2.5 ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {t('saldoCard.step1Amount', '1. Selecciona el Monto a Recargar')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[10000, 20000, 30000, 50000, 100000].map(val => (
                    <button
                      key={val}
                      onClick={() => { setRechargeAmount(val); setCustomAmount(''); }}
                      className={`py-3 rounded-2xl border text-xs font-black transition-all active:scale-95 flex flex-col items-center justify-center ${
                        rechargeAmount === val && !customAmount
                          ? 'bg-[#B30000] text-white border-[#B30000] shadow-md'
                          : dark ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-800 hover:border-zinc-300'
                      }`}
                    >
                      <span>${val.toLocaleString('es-CO')}</span>
                    </button>
                  ))}
                  <div className="relative">
                    <input
                      type="number"
                      placeholder={t('saldoCard.otherAmount', 'Otro valor')}
                      value={customAmount}
                      onChange={e => setCustomAmount(e.target.value)}
                      className={`w-full h-full text-center py-2 rounded-2xl border text-xs font-bold focus:outline-none focus:border-[#B30000] transition-all ${
                        customAmount
                          ? 'border-[#B30000] bg-[#B30000]/10 text-[#B30000] font-black'
                          : dark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-800'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Medio de Pago */}
              <div>
                <label className={`block text-[10px] font-black uppercase tracking-widest mb-2.5 ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {t('saldoCard.step2Payment', '2. Método de Pago Seguro')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'nequi', name: 'Nequi', icon: '🟣', sub: 'Sin costo' },
                    { id: 'daviplata', name: 'Daviplata', icon: '🔴', sub: 'Directo' },
                    { id: 'pse', name: 'PSE Bancos', icon: '🏦', sub: 'Débito' },
                    { id: 'card', name: 'Tarjetas', icon: '💳', sub: 'Visa / MC' },
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-3 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between ${
                        paymentMethod === m.id
                          ? 'border-[#B30000] bg-red-950/20 ring-2 ring-[#B30000]/30'
                          : dark ? 'bg-zinc-800/70 border-zinc-700 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-base">{m.icon}</span>
                        {paymentMethod === m.id && <Check size={12} className="text-[#B30000]" />}
                      </div>
                      <div>
                        <p className={`font-black text-xs ${dark ? 'text-white' : 'text-zinc-900'}`}>{m.name}</p>
                        <p className="text-[8px] text-zinc-500 uppercase font-bold">{m.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Botón de Pago Directo */}
              <button
                onClick={handleExecuteRecharge}
                disabled={isRecharging}
                className="w-full bg-gradient-to-r from-[#B30000] to-[#8E0000] hover:from-[#9c0000] hover:to-[#730000] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isRecharging ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>{t('saldoCard.processingRecharge', 'Procesando recarga segura...')}</span>
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    <span>{t('saldoCard.btnProceedRecharge', 'Recargar')} ${(customAmount ? parseInt(customAmount, 10) || 0 : rechargeAmount).toLocaleString('es-CO')} COP</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                <ShieldCheck size={13} className="text-[#2D8B3C]" />
                <span>{t('saldoCard.sslSecure', 'Transacción cifrada SSL · Pasarela Oficial Empresa Metro de Bogotá')}</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ── PESTAÑA 3: LECTOR NFC CONTACTLESS ── */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'nfc' && (
        <div className={`rounded-3xl p-6 border shadow-sm text-center space-y-6 transition-colors ${
          dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
        }`}>
          {nfcStatus === 'idle' && (
            <div className="flex flex-col items-center py-2">
              <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                <div className="absolute w-28 h-28 rounded-full border-2 border-[#B30000]/40 nfc-ripple" />
                <div className="absolute w-28 h-28 rounded-full border-2 border-[#B30000]/20 nfc-ripple-2" />
                <div className={`relative w-16 h-28 rounded-2xl border-4 flex items-center justify-center shadow-xl ${dark ? 'bg-zinc-800 border-zinc-600' : 'bg-zinc-100 border-zinc-300'}`}>
                  <Wifi size={24} className="text-[#B30000]" />
                </div>
                <div className="absolute -bottom-1 -right-1 nfc-card-float">
                  <div className="w-12 h-8 bg-gradient-to-br from-[#B30000] to-[#2D8B3C] rounded-lg shadow-lg border border-white/40" />
                </div>
              </div>
              <h3 className={`font-black text-lg ${dark ? 'text-white' : 'text-zinc-900'}`}>{t('saldoCard.nfcContactlessTitle', 'Lector NFC Contactless')}</h3>
              <p className={`text-xs mt-1 max-w-xs font-bold leading-relaxed ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {t('saldoCard.nfcSubtitle', 'Acerca tu tarjeta física Tullave o Metro a la parte posterior de tu teléfono para sincronizar saldo al instante.')}
              </p>
              <button
                onClick={handleNFCRead}
                className="w-full mt-6 bg-[#B30000] hover:bg-[#8e0000] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Wifi size={16} />
                {nfcSupported ? t('saldoCard.nfcActivateBtn', 'Activar Sensor NFC') : t('saldoCard.nfcSimulateBtn', 'Simular Lectura NFC')}
              </button>
            </div>
          )}

          {nfcStatus === 'reading' && (
            <div className="py-8 space-y-4">
              <div className="w-20 h-20 rounded-full bg-[#B30000]/20 flex items-center justify-center mx-auto border-2 border-[#B30000]">
                <Wifi size={32} className="text-[#B30000] animate-pulse" />
              </div>
              <p className={`font-black text-base ${dark ? 'text-white' : 'text-zinc-900'}`}>{t('saldoCard.nfcReading', 'Leyendo chip de tarjeta...')}</p>
              <p className="text-xs text-zinc-500">{t('saldoCard.nfcKeepClose', 'Mantén la tarjeta cerca del sensor')}</p>
            </div>
          )}

          {nfcStatus === 'success' && (
            <div className="py-4 space-y-4 nfc-success-pop">
              <div className="w-14 h-14 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto text-green-500">
                <CheckCircle size={30} />
              </div>
              <h4 className={`font-black text-lg ${dark ? 'text-white' : 'text-zinc-900'}`}>{t('saldoCard.nfcSuccess', '¡Tarjeta Sincronizada!')}</h4>
              <p className={`text-xs font-bold ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {t('saldoCard.nfcCurrentBalance', 'Saldo actual:')} <strong className="text-[#B30000] text-sm">${balance.toLocaleString('es-CO')} COP</strong>
              </p>
              <button onClick={resetNFC} className="w-full py-3 rounded-2xl border font-black text-xs uppercase tracking-widest text-zinc-400 hover:text-white">
                {t('saldoCard.nfcNewRead', 'Nueva Lectura')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ── PESTAÑA 4: QR DIGITAL METRO ── */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'qr' && (
        <div className={`rounded-3xl p-6 border shadow-sm text-center space-y-5 transition-colors ${
          dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
        }`}>
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{t('saldoCard.qrQuickAccess', 'Acceso Rápido a Torniquetes')}</span>
            <h3 className={`font-black text-lg italic mt-0.5 ${dark ? 'text-white' : 'text-zinc-900'}`}>{t('saldoCard.qrTitle', 'Boleto QR Dinámico Metro L1')}</h3>
          </div>

          <div className="w-56 h-56 bg-white rounded-3xl p-4 mx-auto shadow-xl border-4 border-zinc-900 flex flex-col items-center justify-center relative">
            <div className="grid grid-cols-6 gap-1.5 w-full h-full p-2">
              {Array.from({ length: 36 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`rounded-md ${
                    (i % 2 === 0 && i % 3 !== 0) || i < 8 || i > 28 || i === 15 || i === 20
                      ? 'bg-zinc-950'
                      : 'bg-zinc-200'
                  }`} 
                />
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 rounded-xl bg-[#B30000] text-white flex items-center justify-center font-black text-xs shadow-md border-2 border-white">
                🚇
              </div>
            </div>
          </div>

          <p className={`text-xs font-bold leading-relaxed ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            {t('saldoCard.qrInstruction', 'Presenta este código frente al lector óptico de los torniquetes en cualquiera de las 16 estaciones de la Línea 1.')}
          </p>

          <div className="flex justify-between items-center px-4 py-3 rounded-2xl bg-zinc-800/40 border border-zinc-700 text-xs font-bold">
            <span className="text-zinc-400">{t('saldoCard.qrFare', 'Tarifa Oficial por Viaje Metro L1:')}</span>
            <span className="text-white font-black">$3.300 COP</span>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ── PESTAÑA 5: HISTORIAL DE MOVIMIENTOS ── */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'historial' && (
        <div className={`rounded-3xl p-5 sm:p-6 border shadow-sm space-y-3 transition-colors ${
          dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
        }`}>
          <div className="flex justify-between items-center mb-2">
            <span className={`text-[10px] font-black uppercase tracking-widest ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>{t('saldoCard.historyTitle', 'Últimos Viajes y Recargas')}</span>
            <span className="text-[9px] font-black text-[#B30000] bg-red-950/30 px-2 py-0.5 rounded-md">{t('saldoCard.historyVerified', 'Verificado SIRCI')}</span>
          </div>

          <div className="space-y-2">
            {history.map(item => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  dark ? 'bg-zinc-800/50 border-zinc-700/60' : 'bg-zinc-50 border-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center text-lg flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className={`font-black text-xs truncate ${dark ? 'text-white' : 'text-zinc-900'}`}>{item.title}</p>
                    <p className="text-[9px] text-zinc-500 font-bold">{item.date}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <span className={`font-black text-xs ${item.color}`}>{item.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODAL PARA ASOCIAR NUEVA TARJETA ── */}
      {isAddCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl relative ${
            dark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <button
              onClick={() => setIsAddCardOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-full text-zinc-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-yellow-400 text-zinc-950 flex items-center justify-center font-bold">
                <CreditCard size={18} />
              </div>
              <div>
                <h3 className="text-base font-black italic">Asociar Nueva Tarjeta</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">TuTarjetaMetro / TuLlave</p>
              </div>
            </div>

            <form onSubmit={handleAddNewCard} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">
                  Nombre o Alias de la Tarjeta
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Mi Tarjeta Metro Trabajo"
                  value={newCardName}
                  onChange={e => setNewCardName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-bold outline-none ${
                    dark ? 'bg-zinc-950 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">
                  Número de Tarjeta (16 dígitos)
                </label>
                <input
                  type="text"
                  required
                  placeholder="1000-0000-0000-0000"
                  maxLength={19}
                  value={newCardNumber}
                  onChange={e => setNewCardNumber(formatCardNumber(e.target.value))}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-xs font-black outline-none ${
                    dark ? 'bg-zinc-950 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">
                  Cédula Asociada (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. 1.020.893.421"
                  value={newCardCedula}
                  onChange={e => setNewCardCedula(formatCedula(e.target.value))}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-xs font-bold outline-none ${
                    dark ? 'bg-zinc-950 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                  }`}
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCardOpen(false)}
                  className={`flex-1 py-3 rounded-xl border font-bold text-xs uppercase tracking-wider ${
                    dark ? 'border-zinc-700 text-zinc-400 hover:text-white' : 'border-zinc-300 text-zinc-600'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={newCardNumber.replace(/\D/g, '').length < 16}
                  className="flex-1 py-3 rounded-xl bg-[#B30000] text-white font-black text-xs uppercase tracking-wider shadow-md hover:bg-[#8e0000] disabled:opacity-50 transition-all"
                >
                  Guardar Tarjeta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Dedicated Modal wrapper component for when Saldo is triggered as a modal popup
export function SaldoModal({ isOpen, onClose, dark }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className={`w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-[2.5rem] border shadow-2xl p-4 sm:p-6 relative my-auto ${
        dark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
      }`}>
        <SaldoCard dark={dark} onClose={onClose} />
      </div>
    </div>
  );
}
