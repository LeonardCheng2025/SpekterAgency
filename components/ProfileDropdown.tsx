import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronDownIcon, UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../lib/hooks/useAuth';

interface ProfileDropdownProps {
  userName: string;
  userId: string;
  userAvatar: string;
}

export default function ProfileDropdown({ userName, userId, userAvatar }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      // 靜默處理錯誤，不顯示提示
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 text-sm focus:outline-none rounded-lg p-2 hover:bg-white/5 transition-all duration-200"
      >
        <img 
          src={userAvatar} 
          alt={userName}
          className="w-8 h-8 rounded-full object-cover border border-brand/50"
        />
        <span className="font-semibold text-white hidden sm:block">{userName}</span>
        <ChevronDownIcon className={`w-4 h-4 text-white/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-accent/95 backdrop-blur-md rounded-xl shadow-glass border border-white/10 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <Link
            href="/profile"
            className="flex items-center space-x-3 px-4 py-3 text-sm text-white hover:bg-white/10 transition-all duration-200 font-medium"
            onClick={() => setIsOpen(false)}
          >
            <UserIcon className="w-5 h-5 text-white/80" />
            <span>View My Profile</span>
          </Link>
          
          <div className="h-px bg-white/10 my-2 mx-4" />
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-white hover:bg-brand/20 transition-all duration-200 text-left font-medium group"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 text-white/80 group-hover:text-brand transition-colors" />
            <span className="group-hover:text-brand transition-colors">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
