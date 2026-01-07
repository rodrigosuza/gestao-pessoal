
import React, { useState, useEffect } from 'react';
import { FixxLogo } from './icons/FixxLogo';
import { WhatsappIcon } from './icons/WhatsappIcon';
import { InstagramIcon } from './icons/InstagramIcon';

const SplashScreen: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 2;
            });
        }, 40);

        return () => clearInterval(interval);
    }, []);

  return (
    <div className="w-screen h-screen bg-white flex flex-col items-center text-center relative">
        <div className="flex-grow flex flex-col justify-center items-center px-4">
            <FixxLogo />
            
            <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 mt-12">
                <div 
                    className="bg-[#3BCE66] h-2 rounded-full transition-all duration-500 ease-linear"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
        <div className="flex-shrink-0 py-8">
            <div className="text-center text-xs text-gray-400 mb-2">
                <p>Versão 1.1.0</p>
            </div>
            <div className="text-gray-500 text-sm text-center space-y-1">
                <p>Criado por Rodrigo Souza</p>
                <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-4 space-y-2 sm:space-y-0 mt-2">
                    <div className="flex items-center space-x-1">
                        <WhatsappIcon />
                        <span>+55 94 99217-0839</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <InstagramIcon />
                        <span>@souza_dsr</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default SplashScreen;