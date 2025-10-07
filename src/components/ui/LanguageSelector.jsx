import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Icon from '../AppIcon';

const LanguageSelector = ({ className = '', showLabel = true }) => {
  const { currentLanguage, supportedLanguages, changeLanguage, getCurrentLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  const currentLang = getCurrentLanguage();

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 transition-all duration-200 text-sm font-medium text-slate-700"
        aria-label={t('common.selectLanguage')}
      >
        <Icon name="Globe" size={16} className="text-slate-500" />
        {showLabel && (
          <span className="hidden sm:inline">{currentLang.nativeName}</span>
        )}
        <span className="sm:hidden">{currentLang.code.toUpperCase()}</span>
        <Icon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={14} 
          className="text-slate-400 transition-transform duration-200" 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-2 border-b border-slate-100 mb-2">
              {t('common.selectLanguage')}
            </div>
            {supportedLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                  currentLanguage === language.code
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="font-medium">{language.nativeName}</span>
                  <span className="text-xs text-slate-500">({language.name})</span>
                </div>
                {currentLanguage === language.code && (
                  <Icon name="Check" size={16} className="text-blue-600" />
                )}
              </button>
            ))}
          </div>
          
          {/* Footer with info */}
          <div className="border-t border-slate-100 p-3">
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Icon name="Info" size={12} />
              <span>Language preference is saved automatically</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;