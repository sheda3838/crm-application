import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, token } = useContext(AuthContext);
  const navigate = useNavigate();

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
    <div 
      className="min-h-screen w-full flex items-center justify-center relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/login.png')` }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] px-4"
      >
        <div 
          className="relative rounded-[32px]"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
            padding: '50px 40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <h1 className="text-[32px] font-bold text-white tracking-wide mb-10">Login</h1>

          <form onSubmit={handleSubmit} className="w-full flex flex-col">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/40 text-red-100 rounded-lg text-sm mb-6"
                >
                  <AlertCircle size={16} className="shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="w-full space-y-8">
              {/* Username Field */}
              <div className="w-full relative">
                <input 
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Username"
                  className="w-full pb-2 bg-transparent border-0 border-b border-white/60 focus:border-white focus:ring-0 text-white placeholder:text-white transition-colors outline-none text-[16px]"
                  style={{ boxShadow: 'none' }}
                />
              </div>

              {/* Password Field */}
              <div className="w-full relative">
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pb-2 bg-transparent border-0 border-b border-white/60 focus:border-white focus:ring-0 text-white placeholder:text-white transition-colors outline-none text-[16px]"
                  style={{ boxShadow: 'none' }}
                />
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="w-full flex items-center gap-3 mt-6">
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded-sm border border-white bg-white appearance-none checked:bg-white checked:relative cursor-pointer transition-colors focus:outline-none flex items-center justify-center shrink-0"
                style={{
                  backgroundImage: rememberMe ? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%231a0b2e' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")` : 'none',
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
              <label htmlFor="remember" className="text-white text-[15px] cursor-pointer select-none">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-[90%] mx-auto py-3.5 mt-14 bg-white text-black font-bold text-[15px] tracking-[0.2em] rounded-full hover:bg-gray-100 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed uppercase"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Submit'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

