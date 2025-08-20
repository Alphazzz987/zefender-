import React, { useState } from 'react';
import { CreditCard, QrCode, Link, Copy, Check } from 'lucide-react';
import { initiateRazorpayPayment, generateQRCodeData, createPaymentLink } from '../../lib/razorpay';
import { createRazorpayOrder, verifyRazorpayPayment, createPayment, updateKiosk, createNotification } from '../../lib/supabase';

interface RazorpayIntegrationProps {
  kioskId: string;
  kioskName: string;
  amount: number;
  customerId: string;
  onPaymentSuccess?: (paymentData: any) => void;
}

const RazorpayIntegration: React.FC<RazorpayIntegrationProps> = ({
  kioskId,
  kioskName,
  amount,
  customerId,
  onPaymentSuccess
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [paymentLink, setPaymentLink] = useState<string>('');
  const [copied, setCopied] = useState<'qr' | 'link' | null>(null);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Create Razorpay order
      const order = await createRazorpayOrder(amount, kioskId);
      
      // Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
        amount: order.amount,
        currency: order.currency,
        name: 'KioskPay',
        description: `Helmet cleaning service - ${kioskName}`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verification = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verification.verified) {
              // Calculate revenue split
              const platformFee = Math.round(amount * 0.1); // 10%
              const ownerRevenue = amount - platformFee; // 90%

              // Store payment in database
              const paymentData = {
                kiosk_id: kioskId,
                amount: amount,
                status: 'completed',
                razorpay_payment_id: response.razorpay_payment_id,
                platform_fee: platformFee,
                owner_revenue: ownerRevenue
              };

              const { data: payment } = await createPayment(paymentData);

              // Update kiosk statistics
              await updateKiosk(kioskId, {
                total_payments: `total_payments + 1`,
                total_revenue: `total_revenue + ${amount}`,
                owner_revenue: `owner_revenue + ${ownerRevenue}`,
                platform_revenue: `platform_revenue + ${platformFee}`
              });

              // Create notification
              await createNotification({
                type: 'payment',
                kiosk_id: kioskId,
                customer_id: customerId,
                message: `New payment received: ₹${amount} for ${kioskName}`,
                priority: 'medium'
              });

              if (onPaymentSuccess) {
                onPaymentSuccess(payment);
              }

              alert('Payment successful!');
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: 'Customer',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        }
      };

      // Initiate payment
      await initiateRazorpayPayment(options);
    } catch (error) {
      console.error('Payment initiation error:', error);
      alert('Failed to initiate payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const generateQRCode = () => {
    const qrData = generateQRCodeData(kioskId, amount);
    setQrCodeData(qrData);
  };

  const generatePaymentLink = () => {
    const link = createPaymentLink(kioskId, amount);
    setPaymentLink(link);
  };

  const copyToClipboard = async (text: string, type: 'qr' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
        Razorpay Payment Integration
      </h3>

      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Payment Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-700">Kiosk: {kioskName}</p>
              <p className="text-blue-700">Amount: ₹{amount}</p>
            </div>
            <div>
              <p className="text-blue-700">Platform Fee (10%): ₹{Math.round(amount * 0.1)}</p>
              <p className="text-blue-700">Owner Revenue (90%): ₹{amount - Math.round(amount * 0.1)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Direct Payment */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <CreditCard className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Pay Now</span>
            <span className="text-xs text-gray-500">Direct payment</span>
          </button>

          {/* Generate QR Code */}
          <button
            onClick={generateQRCode}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <QrCode className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Generate QR</span>
            <span className="text-xs text-gray-500">For kiosk display</span>
          </button>

          {/* Generate Payment Link */}
          <button
            onClick={generatePaymentLink}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Link className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Payment Link</span>
            <span className="text-xs text-gray-500">Shareable URL</span>
          </button>
        </div>

        {/* QR Code Data */}
        {qrCodeData && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-sm font-medium text-gray-900">QR Code Data</h5>
              <button
                onClick={() => copyToClipboard(qrCodeData, 'qr')}
                className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
              >
                {copied === 'qr' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied === 'qr' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <textarea
              value={qrCodeData}
              readOnly
              className="w-full h-20 text-xs font-mono bg-white border border-gray-300 rounded p-2 resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              Use this data to generate a QR code for your kiosk display
            </p>
          </div>
        )}

        {/* Payment Link */}
        {paymentLink && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-sm font-medium text-gray-900">Payment Link</h5>
              <button
                onClick={() => copyToClipboard(paymentLink, 'link')}
                className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
              >
                {copied === 'link' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied === 'link' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <input
              value={paymentLink}
              readOnly
              className="w-full text-xs font-mono bg-white border border-gray-300 rounded p-2"
            />
            <p className="text-xs text-gray-500 mt-2">
              Share this link with customers for easy payment access
            </p>
          </div>
        )}

        {/* Integration Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h5 className="text-sm font-medium text-yellow-900 mb-2">Integration Setup</h5>
          <ol className="text-xs text-yellow-800 space-y-1 list-decimal list-inside">
            <li>Add your Razorpay Key ID to environment variables (VITE_RAZORPAY_KEY_ID)</li>
            <li>Configure webhook endpoints for payment verification</li>
            <li>Set up QR code generation service for kiosk displays</li>
            <li>Test payments in sandbox mode before going live</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RazorpayIntegration;