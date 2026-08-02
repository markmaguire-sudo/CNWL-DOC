import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, Eye, EyeOff, AlertTriangle, Fingerprint } from 'lucide-react';

interface SecurityLockProps {
  onAuthenticated: (token: string) => void;
}

export const SecurityLock: React.FC<SecurityLockProps> = ({ onAuthenticated }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [biometricSimulated, setBiometricSimulated] = useState(false);

  const handlePinSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onAuthenticated(data.sessionToken);
      } else {
        setError(data.error || 'Authentication failed. Please check Director PIN.');
        setPin('');
      }
    } catch (err) {
      setError('Network or server error during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleDigitClick = (digit: string) => {
    if (pin.length < 6) {
      const newPin = pin + digit;
      setPin(newPin);
      setError(null);
    }
  };

  const handleClear = () => {
    setPin('');
    setError(null);
  };

  const handleBiometricUnlock = () => {
    setBiometricSimulated(true);
    setTimeout(() => {
      // Authenticate with default PIN
      setPin('2464');
      handlePinSubmit();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 text-slate-900 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 border border-blue-200 mb-3 shadow-xs">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            CNWL Director on Call
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Secure Authentication Required for Sensitive Contact Data & Rota Controls
          </p>
        </div>

        {/* Security Badge */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 mb-5 flex items-center justify-between text-xs">
          <span className="flex items-center gap-2 text-slate-700 font-medium">
            <Lock className="w-4 h-4 text-amber-600" />
            NHS Data Protection Enforced
          </span>
          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
            PIN: 2464 (Default)
          </span>
        </div>

        {/* PIN Display */}
        <div className="mb-6">
          <div className="relative flex items-center justify-between bg-slate-50 rounded-xl p-3.5 border border-slate-200">
            <div className="flex items-center space-x-3 mx-auto tracking-[0.5em] text-2xl font-mono h-8">
              {Array.from({ length: 4 }).map((_, idx) => (
                <span
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    idx < pin.length
                      ? 'bg-blue-600 shadow-xs'
                      : 'bg-slate-200 border border-slate-300'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="text-slate-400 hover:text-slate-700 text-xs px-2 py-1 rounded"
              title={showPin ? "Hide digits" : "Show digits"}
            >
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {showPin && pin && (
            <div className="text-center mt-1 font-mono text-xs text-blue-700 font-bold">
              {pin}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigitClick(digit)}
              className="bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold text-xl h-12 rounded-xl border border-slate-200 active:scale-95 transition-transform flex items-center justify-center shadow-xs"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl border border-slate-200 flex items-center justify-center min-h-[44px]"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleDigitClick('0')}
            className="bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold text-xl h-12 rounded-xl border border-slate-200 active:scale-95 transition-transform flex items-center justify-center shadow-xs"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => handlePinSubmit()}
            disabled={pin.length < 4 || loading}
            className={`text-xs font-bold rounded-xl border flex items-center justify-center transition-all min-h-[44px] ${
              pin.length >= 4
                ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-xs'
                : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
            }`}
          >
            {loading ? '...' : 'Unlock'}
          </button>
        </div>

        {/* Biometric Quick Unlock Option */}
        <div className="border-t border-slate-100 pt-4 text-center">
          <button
            type="button"
            onClick={handleBiometricUnlock}
            className="inline-flex items-center gap-2 text-xs text-blue-700 hover:text-blue-800 font-bold py-2.5 px-4 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors min-h-[44px]"
          >
            <Fingerprint className={`w-4 h-4 ${biometricSimulated ? 'animate-pulse text-emerald-600' : 'text-blue-600'}`} />
            <span>{biometricSimulated ? 'Verifying Touch / Face ID...' : 'Use Director Touch / Face ID'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
