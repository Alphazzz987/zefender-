// Razorpay integration utilities
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiateRazorpayPayment = async (options: RazorpayOptions): Promise<void> => {
  const isLoaded = await loadRazorpayScript();
  
  if (!isLoaded) {
    throw new Error('Failed to load Razorpay SDK');
  }

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};

export const generateQRCodeData = (kioskId: string, amount: number): string => {
  // Generate QR code data for Razorpay
  // This would typically include your merchant details and payment amount
  const qrData = {
    merchant_id: import.meta.env.VITE_RAZORPAY_MERCHANT_ID || 'your_merchant_id',
    amount: amount * 100, // Convert to paise
    currency: 'INR',
    kiosk_id: kioskId,
    timestamp: Date.now()
  };
  
  return JSON.stringify(qrData);
};

export const createPaymentLink = (kioskId: string, amount: number): string => {
  // Create a payment link for the kiosk
  const baseUrl = window.location.origin;
  const paymentParams = new URLSearchParams({
    kiosk_id: kioskId,
    amount: amount.toString(),
    currency: 'INR'
  });
  
  return `${baseUrl}/pay?${paymentParams.toString()}`;
};