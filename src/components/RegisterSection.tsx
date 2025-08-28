import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import OTPVerification from './OTPVerification';

// ✅ Central API base URL
const API_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:3000/api/v1'
    : 'https://your-production-domain.com/api/v1';

interface FormData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phone?: string;
}

const RegisterSection: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [tempUserData, setTempUserData] = useState<FormData | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    // Validate phone number if provided
    if (formData.phone && !/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
      setError('Please provide a valid phone number with country code (e.g., +1234567890)');
      return;
    }

    try {
      setIsLoading(true);
      
      // Prepare the data to send
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        phone: formData.phone || undefined // Only include if provided
      };
      
      // Try to sign up the user
      await axios.post(`${API_URL}/auth/signup`, userData);
      
      // If we get here, the user either:
      // 1. Is new and needs to verify their email (status 201)
      // 2. Exists but is unverified (status 200)
      setTempUserData({ ...formData });
      setShowOTP(true);
      
    } catch (error: any) {
      // Handle specific error for existing verified user
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
        setError('An account with this email already exists. Please log in instead.');
      } else {
        setError(error.response?.data?.message || 'Failed to process your request. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerify = async (otp: string): Promise<boolean> => {
    if (!tempUserData) return false;
    
    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp`, {
        email: tempUserData.email,
        otp
      });
      
      if (response.data.success) {
        navigate('/login');
        return true;
      }
      return false;
    } catch (error) {
      console.error('OTP verification failed:', error);
      return false;
    }
  };
  
  const handleResendOTP = async (): Promise<boolean> => {
    if (!tempUserData) return false;
    
    try {
      await axios.post(`${API_URL}/auth/resend-otp`, {
        email: tempUserData.email
      });
      return true;
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      return false;
    }
  };
  
  const handleBackToRegister = () => {
    setShowOTP(false);
    setError('');
  };
  
  

  if (showOTP && tempUserData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <OTPVerification 
          email={tempUserData.email}
          onVerify={handleOTPVerify}
          onResend={handleResendOTP}
          onBack={handleBackToRegister}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex rounded-lg shadow-lg overflow-hidden max-w-4xl w-full my-8">
        {/* Left Panel */}
        <div className="w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 p-12 text-white hidden md:flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold mb-4">Join Our Community</h1>
          <p className="text-lg mb-8">
            Unlock your potential. Get access to exclusive courses, tools, and a vibrant community of learners and professionals.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center">
              <ArrowRight className="w-6 h-6 mr-2 text-green-400" />
              <span>Personalized Career Paths</span>
            </li>
            <li className="flex items-center">
              <ArrowRight className="w-6 h-6 mr-2 text-green-400" />
              <span>Expert-led Courses</span>
            </li>
            <li className="flex items-center">
              <ArrowRight className="w-6 h-6 mr-2 text-green-400" />
              <span>Cutting-edge Job Tools</span>
            </li>
            <li className="flex items-center">
              <ArrowRight className="w-6 h-6 mr-2 text-green-400" />
              <span>24/7 Support</span>
            </li>
          </ul>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-gray-50">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Get Started</h2>
          <p className="text-gray-600 mb-8">Create your account to begin your journey.</p>

          

          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="full-name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
             <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirm-password"
                  name="passwordConfirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition duration-200"
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (with country code)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                  isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors`}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSection;
