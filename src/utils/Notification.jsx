import React, { useState, useEffect } from 'react';

function Notification({ message, type, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-green-400' : 'bg-red-400';

  return (
    <div className={`fixed top-6 right-6 ${bgColor} text-white py-3 px-6 rounded shadow-lg`}>
      {message}
    </div>
  );
}

export default Notification;