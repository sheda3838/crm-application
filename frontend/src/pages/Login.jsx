import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, LogIn, AlertCircle, Loader2, Moon, Sun } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const { login, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (token) navigate('/dashboard');
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await API.post('/auth/login', { email, password });
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-[#0a0514] overflow-hidden">
      {/* Background with deeper contrast */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#1a0b2e] via-[#0a0514] to-[#120621]" />
      
      {/* Subtle Star Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: '2px',
              height: '2px',
            }}
          />
        ))}
      </div>

      {/* Theme Toggle */}
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-8 right-8 p-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white/50 hover:text-white transition-all z-50"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[500px] px-6 z-10"
      >
        {/* Glass Card with better structure */}
        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 shadow-[0_50px_100px_rgba(0,0,0,0.4)] rounded-[3.5rem] p-12 md:p-16">
          
          <div className="flex flex-col items-center mb-14">
            <div className="w-24 h-24 mb-6">
              <img src="/logo.png" alt="CRM Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Login</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/40 text-red-100 rounded-2xl text-sm font-bold"
                >
                  <AlertCircle size={18} className="shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6">
              {/* Username Field */}
              <div className="relative group">
                <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-white/40 group-focus-within:text-white transition-colors">
                  <User size={22} />
                </div>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Username"
                  className="w-full px-8 py-5 bg-white/15 border border-white/10 rounded-full focus:ring-4 focus:ring-white/10 focus:border-white/30 text-white placeholder:text-white/40 transition-all outline-none font-semibold text-lg"
                />
              </div>

              {/* Password Field */}
              <div className="relative group">
                <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-white/40 group-focus-within:text-white transition-colors">
                  <Lock size={22} />
                </div>
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-8 py-5 bg-white/15 border border-white/10 rounded-full focus:ring-4 focus:ring-white/10 focus:border-white/30 text-white placeholder:text-white/40 transition-all outline-none font-semibold text-lg"
                />
              </div>
            </div>

            {/* Login Button with better padding */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full py-5 bg-white text-[#0a0514] font-black text-xl rounded-full shadow-[0_15px_30px_rgba(255,255,255,0.1)] hover:bg-slate-50 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={28} />
              ) : (
                <>
                  <LogIn size={26} />
                  Login
                </>
              )}
            </motion.button>
          </form>
        </div>
        
        <p className="mt-14 text-center text-[12px] font-extrabold uppercase tracking-[0.5em] text-white/10">
          Nexus CRM System &bull; Enterprise Secure
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
