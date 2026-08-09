import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  Copy,
  Check,
  Code2,
} from 'lucide-react';
import {
  EXPO_MAIN_INDEX_CODE,
  EXPO_PACKAGE_JSON,
  EXPO_APP_JSON,
  EAS_JSON,
  downloadFile
} from '../utils/reactNativeExport';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({ isOpen, onClose }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, type: 'code' | 'cmd') => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
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
                Expo React Native Project & APK Exporter
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                Package: com.rahul.emipro | Build Android APK via EAS
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
          {/* Quick Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2">
            <span className="font-extrabold text-blue-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <Smartphone className="w-4 h-4 text-blue-600" />
              Expo Project Files Ready in Repository
            </span>
            <p className="text-blue-800 leading-relaxed font-medium">
              We have generated the complete React Native Expo project structure inside <code className="bg-blue-100 px-1.5 py-0.5 rounded font-bold text-blue-900">/loan-emi-calculator/</code> including <code className="font-bold">app.json</code>, <code className="font-bold">eas.json</code>, <code className="font-bold">package.json</code>, and Expo Router screens.
            </p>
          </div>

          {/* Download Configs & Source */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
            <span className="font-extrabold text-gray-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <Code2 className="w-4 h-4 text-blue-600" />
              1. Download Expo Configuration Files
            </span>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => downloadFile('app.json', EXPO_APP_JSON)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl shadow-sm transition-all cursor-pointer text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                app.json (com.rahul.emipro)
              </button>

              <button
                onClick={() => downloadFile('eas.json', EAS_JSON)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl shadow-sm transition-all cursor-pointer text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                eas.json (APK Profile)
              </button>

              <button
                onClick={() => downloadFile('package.json', EXPO_PACKAGE_JSON)}
                className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3.5 py-2 rounded-xl border border-gray-200 transition-all cursor-pointer text-xs"
              >
                <Download className="w-3.5 h-3.5 text-gray-500" />
                package.json
              </button>

              <button
                onClick={() => downloadFile('index.tsx', EXPO_MAIN_INDEX_CODE)}
                className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3.5 py-2 rounded-xl border border-gray-200 transition-all cursor-pointer text-xs"
              >
                <Download className="w-3.5 h-3.5 text-gray-500" />
                app/index.tsx
              </button>
            </div>

            {/* CLI Instructions */}
            <div className="pt-2">
              <span className="text-gray-500 text-[11px] font-bold block mb-1">
                2. Command to build standalone APK:
              </span>
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 font-mono text-[11px] text-gray-800 flex items-center justify-between">
                <span>npx eas build -p android --profile preview</span>
                <button
                  onClick={() => copyToClipboard('npx eas build -p android --profile preview', 'cmd')}
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

