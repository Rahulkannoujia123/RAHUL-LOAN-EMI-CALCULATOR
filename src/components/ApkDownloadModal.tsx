import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  Copy,
  Check,
  Code2,
  Terminal,
  ExternalLink,
  Info
} from 'lucide-react';
import {
  REACT_NATIVE_APP_CODE,
  PACKAGE_JSON_CODE,
  downloadFile
} from '../utils/reactNativeExport';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({ isOpen, onClose }) => {
  const [copiedAppCode, setCopiedAppCode] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const buildCmd = `npx create-expo-app EMIApp --template blank\ncd EMIApp\nnpx expo run:android`;

  const copyToClipboard = (text: string, type: 'code' | 'cmd') => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedAppCode(true);
      setTimeout(() => setCopiedAppCode(false), 2000);
    } else {
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white border border-gray-200 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 bg-blue-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                Get Android APK & React Native Code
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                Install as Mobile PWA or build native Android APK with Expo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-700">
          {/* Option 1: One-click PWA Mobile Install */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-emerald-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                Option 1: Instant Mobile App Install (PWA)
              </span>
              <span className="text-[10px] bg-emerald-600 text-white px-2.5 py-0.5 rounded-full font-extrabold">
                Recommended
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed font-medium">
              Open this website on your Android or iPhone Chrome/Safari browser and tap{' '}
              <strong className="text-gray-900 font-bold">"Add to Home Screen"</strong> or{' '}
              <strong className="text-gray-900 font-bold">"Install App"</strong> in browser menu. It runs offline like a native app!
            </p>
          </div>

          {/* Option 2: Download React Native Source & Generate APK */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
            <span className="font-extrabold text-gray-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <Code2 className="w-4 h-4 text-blue-600" />
              Option 2: React Native Expo Source Code & APK Build
            </span>

            <p className="text-gray-600 font-medium">
              Download the complete React Native code files to build your standalone Android APK using Expo or React Native CLI.
            </p>

            {/* Downloads */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => downloadFile('App.tsx', REACT_NATIVE_APP_CODE)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download App.tsx
              </button>

              <button
                onClick={() => downloadFile('package.json', PACKAGE_JSON_CODE)}
                className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2.5 rounded-xl border border-gray-200 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-gray-500" />
                Download package.json
              </button>

              <button
                onClick={() => copyToClipboard(REACT_NATIVE_APP_CODE, 'code')}
                className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2.5 rounded-xl border border-gray-200 transition-all cursor-pointer"
              >
                {copiedAppCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                {copiedAppCode ? 'Copied Code!' : 'Copy React Native Code'}
              </button>
            </div>

            {/* CLI Instructions */}
            <div className="pt-2">
              <span className="text-gray-500 text-[11px] font-bold block mb-1">
                Command to generate APK with Expo EAS:
              </span>
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 font-mono text-[11px] text-gray-800 flex items-center justify-between">
                <span>eas build -p android --profile preview</span>
                <button
                  onClick={() => copyToClipboard('eas build -p android --profile preview', 'cmd')}
                  className="text-blue-600 hover:text-blue-700 cursor-pointer font-bold ml-2"
                >
                  {copiedCmd ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
