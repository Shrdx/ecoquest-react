'use client';
import { useState } from 'react';
import { AuthService } from '@/services/authService';

export default function TestPage() {
  const [result, setResult] = useState<string>('');

  const testSignup = async () => {
    try {
      setResult('Testing signup...');
      const user = await AuthService.signup({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });
      setResult(`Signup successful! User: ${JSON.stringify(user, null, 2)}`);
    } catch (error) {
      setResult(`Signup failed: ${(error as Error).message}`);
    }
  };

  const testLogin = async () => {
    try {
      setResult('Testing login...');
      const user = await AuthService.login({
        email: 'test@example.com',
        password: 'password123'
      });
      setResult(`Login successful! User: ${JSON.stringify(user, null, 2)}`);
    } catch (error) {
      setResult(`Login failed: ${(error as Error).message}`);
    }
  };

  const checkStorage = () => {
    const users = localStorage.getItem('ecoquest_users');
    const currentUser = localStorage.getItem('ecoquest_current_user');
    setResult(`Users: ${users}\nCurrent User: ${currentUser}`);
  };

  return (
    <div className="container-eco py-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      
      <div className="space-x-4 mb-4">
        <button onClick={testSignup} className="btn-primary-eco">
          Test Signup
        </button>
        <button onClick={testLogin} className="btn-secondary-eco">
          Test Login
        </button>
        <button onClick={checkStorage} className="btn-secondary-eco">
          Check Storage
        </button>
      </div>
      
      <pre className="bg-black/20 p-4 rounded-lg text-sm whitespace-pre-wrap">
        {result}
      </pre>
    </div>
  );
}
