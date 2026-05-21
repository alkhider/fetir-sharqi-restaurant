import React from 'react';
import { Phone } from 'lucide-react';

const WhatsAppButton = React.memo(function WhatsAppButton() {
  const phoneNumber = '966557478343';
  const message = encodeURIComponent(
    'مرحباً فطير شرقي! أرغب في الطلب.'
  );

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-success-green rounded-full flex items-center justify-center shadow-lg animate-pulse-scale hover:scale-110 transition-transform duration-300"
      aria-label="Order via WhatsApp"
    >
      <Phone className="w-7 h-7 text-white" />
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-success-green animate-ping opacity-30" />
    </a>
  );
});

export default WhatsAppButton;
