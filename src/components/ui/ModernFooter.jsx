import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

const ModernFooter = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: '/public-landing-page', label: 'Home' },
    { path: '/public-reports-listing', label: 'Browse Reports' },
    { path: '/issue-reporting-form', label: 'Report Issue' },
    { path: '/how-it-works', label: 'How It Works' },
    { path: '/analytics-dashboard', label: 'Analytics' }
  ];

  const supportLinks = [
    { path: '/support', label: 'Help Center' },
    { path: '/contact', label: 'Contact Us' },
    { path: '/privacy', label: 'Privacy Policy' },
    { path: '/terms', label: 'Terms of Service' },
    { path: '/faq', label: 'FAQ' }
  ];

  const socialLinks = [
    { icon: 'Twitter', href: '#', label: 'Twitter' },
    { icon: 'Facebook', href: '#', label: 'Facebook' },
    { icon: 'Instagram', href: '#', label: 'Instagram' },
    { icon: 'Linkedin', href: '#', label: 'LinkedIn' },
    { icon: 'Youtube', href: '#', label: 'YouTube' }
  ];

  const governmentInitiatives = [
    { name: 'Digital India', logo: '🇮🇳' },
    { name: 'Smart Cities Mission', logo: '🏙️' },
    { name: 'Make in India', logo: '🛠️' },
    { name: 'Startup India', logo: '🚀' }
  ];

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <Icon name="Shield" size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  Civic<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-400">Care</span>
                </h3>
                <p className="text-slate-400 text-sm">Community First</p>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed mb-6">
              Empowering citizens to create positive change in their communities through 
              transparent, efficient civic engagement and real-time issue tracking.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-green-400">
                <Icon name="Shield" size={16} />
                <span className="text-sm">Secure & Encrypted</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <Icon name="ChevronRight" size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <Icon name="ChevronRight" size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Contact Info */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center space-x-3 text-slate-300">
                <Icon name="Mail" size={16} className="text-blue-400" />
                <span className="text-sm">support@civiccare.gov</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <Icon name="Phone" size={16} className="text-green-400" />
                <span className="text-sm">+91-11-2345-6789</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <Icon name="Clock" size={16} className="text-yellow-400" />
                <span className="text-sm">24/7 Support Available</span>
              </div>
            </div>
          </div>

          {/* Social & Government */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Connect With Us</h4>
            
            {/* Social Media */}
            <div className="flex space-x-3 mb-8">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                  aria-label={social.label}
                >
                  <Icon name={social.icon} size={18} className="text-slate-300 group-hover:text-white" />
                </a>
              ))}
            </div>

            {/* Government Initiatives */}
            <div>
              <h5 className="text-sm font-semibold mb-4 text-slate-400 uppercase tracking-wide">Supported By</h5>
              <div className="grid grid-cols-2 gap-3">
                {governmentInitiatives.map((initiative) => (
                  <div 
                    key={initiative.name}
                    className="bg-slate-800 rounded-lg p-3 text-center hover:bg-slate-700 transition-colors duration-200 group cursor-pointer"
                  >
                    <div className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-200">
                      {initiative.logo}
                    </div>
                    <p className="text-xs text-slate-300 group-hover:text-white transition-colors duration-200">
                      {initiative.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-slate-400 text-sm">
              © {currentYear} CivicCare. All rights reserved. Built with ❤️ for the community.
            </div>

            {/* Certifications */}
            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={14} className="text-green-400" />
                <span>ISO 27001 Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Lock" size={14} className="text-blue-400" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Award" size={14} className="text-yellow-400" />
                <span>Government Approved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;