import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Network } from 'lucide-react';
import { useAuth } from '../../context/authContext.jsx';
import { api } from '../../lib/api';

function VerifyEmail() {
  const { state } = useLocation();
  const email = state?.email;
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  if (!email) return <Navigate to="/signup" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      await verifyEmail(email, otp);
      navigate('/onboarding');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const resend = async () => {
    setError('');
    setInfo('');
    try {
      await api.post('/auth/resend-otp', { email });
      setInfo('A new code has been sent.');
      setCooldown(60);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Network className="text-orange-500" />
          <span className="text-orange-500 font-bold text-xl">MindMesh</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
          <h1 className="text-2xl font-bold text-white mb-1">Verify your email</h1>
          <p className="text-zinc-400 mb-6">
            We sent a 6-digit code to <span className="text-white">{email}</span>. It expires in 10 minutes.
          </p>

          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">{error}</div>}
          {info && <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg px-4 py-2 mb-4">{info}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              inputMode="numeric"
              className="w-full text-center text-2xl tracking-[0.5em] bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-medium py-2 rounded-lg transition"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>

          <p className="text-zinc-400 text-sm text-center mt-6">
            Didn't get the code?{' '}
            {cooldown > 0 ? (
              <span className="text-zinc-500">Resend in {cooldown}s</span>
            ) : (
              <button onClick={resend} className="text-orange-500 hover:underline">Resend code</button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;