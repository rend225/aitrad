import React, { useState } from 'react';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import { CheckCircle, XCircle, Loader, Settings, Database, Users, Crown } from 'lucide-react';

const FirebaseSetupHelper: React.FC = () => {
  const { user } = useAuth();
  const [setupStatus, setSetupStatus] = useState<any>({});
  const [isRunning, setIsRunning] = useState(false);

  const runSetupTask = async (taskName: string, taskFn: () => Promise<any>) => {
    try {
      setSetupStatus(prev => ({ ...prev, [taskName]: { status: 'running' } }));
      const result = await taskFn();
      setSetupStatus(prev => ({ ...prev, [taskName]: { status: 'success', result } }));
      return result;
    } catch (error: any) {
      setSetupStatus(prev => ({ 
        ...prev, 
        [taskName]: { 
          status: 'error', 
          error: error.message || error.toString()
        } 
      }));
      throw error;
    }
  };

  const setupFirestore = async () => {
    if (isRunning || !user) return;
    setIsRunning(true);
    setSetupStatus({});

    try {
      // Test 1: Check user document exists
      await runSetupTask('user_doc', async () => {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          return `User document exists: ${userDoc.data().email}`;
        } else {
          // Create user document
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            provider: 'email',
            plan: 'free',
            used_today: 0,
            recommendation_limit: 1,
            subscriptionId: null,
            school: 'default',
            createdAt: new Date(),
            isAdmin: false,
            emailVerified: true,
            registrationCompleted: true
          });
          return 'User document created successfully';
        }
      });

      // Test 2: Setup plans collection
      await runSetupTask('plans_setup', async () => {
        const plans = [
          {
            id: 'free',
            name: 'Free',
            price: 0,
            recommendations_per_day: 5,
            features: ['5 AI Trading analyses per month', 'Basic market insights', 'Email support'],
            popular: false,
            paypal_plan_id: null
          },
          {
            id: 'basic',
            name: 'Basic',
            price: 29,
            recommendations_per_day: 50,
            features: ['50 AI Trading analyses per month', 'Advanced market insights', 'Priority support'],
            popular: false,
            paypal_plan_id: 'P-3RX65613XN908640NM3DIWUA'
          },
          {
            id: 'pro',
            name: 'Pro',
            price: 79,
            recommendations_per_day: 100,
            features: ['100 AI Trading analyses per month', 'Premium insights', 'Real-time signals'],
            popular: true,
            paypal_plan_id: 'P-0CX65613XN908640NM3DIWUB'
          },
          {
            id: 'elite',
            name: 'Elite',
            price: 199,
            recommendations_per_day: 200,
            features: ['200 AI Trading analyses per month', 'VIP insights', 'All features'],
            popular: false,
            paypal_plan_id: 'P-1DX65613XN908640NM3DIWUC'
          }
        ];

        for (const plan of plans) {
          await setDoc(doc(db, 'plans', plan.id), plan);
        }
        return `${plans.length} plans created successfully`;
      });

      // Test 3: Setup schools collection
      await runSetupTask('schools_setup', async () => {
        const schools = [
          {
            id: 'default',
            name: 'AI Trading Expert',
            prompt: 'You are a professional AI trading expert. Analyze the provided market data and generate actionable trading recommendations.',
            active: true
          },
          {
            id: 'conservative',
            name: 'Conservative Trader',
            prompt: 'You are a conservative trading expert focused on low-risk, stable returns. Analyze market data with emphasis on risk management.',
            active: true
          },
          {
            id: 'aggressive',
            name: 'Aggressive Trader',
            prompt: 'You are an aggressive trading expert focused on high-growth opportunities. Analyze market data for maximum profit potential.',
            active: true
          }
        ];

        for (const school of schools) {
          await setDoc(doc(db, 'schools', school.id), school);
        }
        return `${schools.length} trading schools created successfully`;
      });

      // Test 4: Test read permissions
      await runSetupTask('read_test', async () => {
        const plansSnapshot = await getDocs(collection(db, 'plans'));
        const schoolsSnapshot = await getDocs(collection(db, 'schools'));
        return `Read test successful: ${plansSnapshot.size} plans, ${schoolsSnapshot.size} schools`;
      });

      console.log('✅ Firebase setup completed successfully');
    } catch (error) {
      console.error('❌ Firebase setup failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Loader className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Database className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20 text-green-300';
      case 'error':
        return 'bg-red-500/10 border-red-500/20 text-red-300';
      case 'running':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-300';
      default:
        return 'bg-gray-500/10 border-gray-500/20 text-gray-300';
    }
  };

  const getTaskIcon = (taskName: string) => {
    switch (taskName) {
      case 'user_doc':
        return <Users className="h-4 w-4" />;
      case 'plans_setup':
        return <Crown className="h-4 w-4" />;
      case 'schools_setup':
        return <Settings className="h-4 w-4" />;
      case 'read_test':
        return <Database className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  const getTaskDisplayName = (taskName: string) => {
    const names = {
      'user_doc': 'User Document Setup',
      'plans_setup': 'Plans Collection Setup',
      'schools_setup': 'Schools Collection Setup',
      'read_test': 'Permissions Test'
    };
    return names[taskName as keyof typeof names] || taskName;
  };

  if (!user) {
    return (
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-300">
        Please log in to run Firebase setup.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-900 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Firebase Setup Helper</h2>
        <button
          onClick={setupFirestore}
          disabled={isRunning}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium"
        >
          {isRunning ? 'Setting Up...' : 'Run Setup'}
        </button>
      </div>

      <div className="space-y-3">
        {Object.entries(setupStatus).map(([taskName, result]: [string, any]) => (
          <div
            key={taskName}
            className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getTaskIcon(taskName)}
                {getStatusIcon(result.status)}
                <span className="font-medium">{getTaskDisplayName(taskName)}</span>
              </div>
              <span className="text-sm opacity-75">
                {result.status === 'success' && result.result}
                {result.status === 'error' && 'Failed'}
                {result.status === 'running' && 'Running...'}
              </span>
            </div>
            {result.error && (
              <div className="mt-2 text-sm opacity-90">
                <strong>Error:</strong> {result.error}
              </div>
            )}
          </div>
        ))}

        {Object.keys(setupStatus).length === 0 && (
          <div className="text-center py-8 text-gray-400">
            Click "Run Setup" to initialize Firebase collections and test permissions.
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <h4 className="text-blue-300 font-semibold mb-2">What This Does:</h4>
        <ul className="text-blue-200 text-sm space-y-1">
          <li>• Creates/verifies your user document</li>
          <li>• Sets up pricing plans collection</li>
          <li>• Initializes trading schools collection</li>
          <li>• Tests Firestore read/write permissions</li>
        </ul>
      </div>
    </div>
  );
};

export default FirebaseSetupHelper;
