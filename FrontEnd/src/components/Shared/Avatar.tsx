import React from 'react';
import Image from 'next/image';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt = 'User', size = 'md', status, className }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <div className="relative inline-block">
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 border border-gray-100`}>
        {src ? (
          <Image 
            src={src} 
            alt={alt} 
            width={48} 
            height={48} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600 font-bold">
            {alt.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      {status && (
        <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border-2 border-white ${
          status === 'online' ? 'bg-green-500' : 'bg-gray-400'
        }`} />
      )}
    </div>
  );
};

export default Avatar;
