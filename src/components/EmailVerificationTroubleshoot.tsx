import React, { useState } from 'react';
import { resendVerificationEmail } from '../services/auth';
import { Mail, RefreshCw, CheckCircle, AlertCircle, Info, ExternalLink } from 'lucide-react';

const EmailVerificationTroubleshoot: React.FC = () => {
  const [isResending, setIsResending] = useState(false);
  const [resendResult, setResendResult] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendResult(null);
    setErrorMessage('');

    try {
      await resendVerificationEmail();
      setResendResult('success');
    } catch (error: any) {
      setResendResult('error');
      setErrorMessage(error.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-900 rounded-lg border border-gray-700">
      <div className="text-center mb-6">
        <Mail className="h-12 w-12 text-blue-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Email Verification Issues?</h2>
        <p className="text-gray-300">
          If you're not receiving verification emails, here are some solutions:
        </p>
      </div>

      {/* Troubleshooting Steps */}
      <div className="space-y-4 mb-6">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h3 className="font-semibold text-blue-300 mb-3 flex items-center">
            <Info className="h-4 w-4 mr-2" />
            Common Solutions
          </h3>
          <ul className="text-blue-200 text-sm space-y-2">
            <li>• <strong>Check spam/junk folder</strong> - Verification emails often end up there</li>
            <li>• <strong>Wait 5-10 minutes</strong> - Email delivery can be delayed</li>
            <li>• <strong>Check for typos</strong> - Make sure your email address is correct</li>
            <li>• <strong>Whitelist Firebase</strong> - Add noreply@firebase.com to your contacts</li>
            <li>• <strong>Try a different email</strong> - Some providers block automated emails</li>
          </ul>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-300 mb-3 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            Development Mode Notice
          </h3>
          <p className="text-yellow-200 text-sm">
            For development/testing purposes, email verification is currently <strong>optional</strong>. 
            You can register and login without verifying your email. In production, verification would be required.
          </p>
        </div>
      </div>

      {/* Resend Email Button */}
      <div className="mb-6">
        <button
          onClick={handleResendEmail}
          disabled={isResending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
          <span>{isResending ? 'Resending Email...' : 'Resend Verification Email'}</span>
        </button>

        {/* Resend Results */}
        {resendResult === 'success' && (
          <div className="mt-3 bg-green-500/10 border border-green-500/20 text-green-300 px-4 py-3 rounded-lg flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Verification email sent! Check your inbox (and spam folder).</span>
          </div>
        )}

        {resendResult === 'error' && (
          <div className="mt-3 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span>Failed to send email: {errorMessage}</span>
          </div>
        )}
      </div>

      {/* Email Provider Specific Tips */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="font-semibold text-white mb-3">Email Provider Specific Tips:</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-300 mb-2"><strong>Gmail:</strong></p>
            <ul className="text-gray-400 space-y-1">
              <li>• Check "Promotions" tab</li>
              <li>• Check "Spam" folder</li>
              <li>• Add noreply@firebase.com to contacts</li>
            </ul>
          </div>
          <div>
            <p className="text-gray-300 mb-2"><strong>Outlook/Hotmail:</strong></p>
            <ul className="text-gray-400 space-y-1">
              <li>• Check "Junk Email" folder</li>
              <li>• Add firebase.com to safe senders</li>
              <li>• Check email rules/filters</li>
            </ul>
          </div>
          <div>
            <p className="text-gray-300 mb-2"><strong>Yahoo:</strong></p>
            <ul className="text-gray-400 space-y-1">
              <li>• Check "Spam" folder</li>
              <li>• Add to address book</li>
              <li>• Check email filters</li>
            </ul>
          </div>
          <div>
            <p className="text-gray-300 mb-2"><strong>Corporate Email:</strong></p>
            <ul className="text-gray-400 space-y-1">
              <li>• Contact IT admin</li>
              <li>• Whitelist *.firebase.com</li>
              <li>• Use personal email instead</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Support Contact */}
      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm mb-3">Still having issues?</p>
        <a
          href="mailto:support@aitrader.com?subject=Email Verification Issue"
          className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <Mail className="h-4 w-4" />
          <span>Contact Support</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};

export default EmailVerificationTroubleshoot;
