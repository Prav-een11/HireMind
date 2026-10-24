'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Brain, Code, FileText, BarChart3, History, Settings, User } from 'lucide-react';
import DemoModeBadge from './DemoModeBadge';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: Brain },
    { name: 'New Interview', href: '/interview/new', icon: Sparkles },
    { name: 'Practice Mode', href: '/practice', icon: Brain },
    { name: 'Coding', href: '/coding-interview', icon: Code },
    { name: 'Resume AI', href: '/resume-analyzer', icon: FileText },
    { name: 'History', href: '/history', icon: History },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E2E5E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2 text-[#17201B] font-semibold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-[#087F5B] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              H
            </div>
            <span>Hire<span className="text-[#087F5B]">Mind</span></span>
          </Link>
          <DemoModeBadge />
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-[#DDF3EA] text-[#087F5B]'
                    : 'text-[#66736B] hover:text-[#17201B] hover:bg-[#F1F3EF]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User / Quick Actions */}
        <div className="flex items-center space-x-3">
          <Link
            href="/interview/new"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#087F5B] hover:bg-[#066749] rounded-lg transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            Start Interview
          </Link>
          <Link
            href="/settings"
            className="p-2 text-[#66736B] hover:text-[#17201B] hover:bg-[#F1F3EF] rounded-lg transition-colors"
            title="Settings & Profile"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
