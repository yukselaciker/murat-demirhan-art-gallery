// ============================================
// USE FOCUS TRAP HOOK - MURAT DEMİRHAN PORTFOLYO
// Modal için erişilebilirlik focus yönetimi
// ============================================

import { useEffect, useRef } from 'react';

export function useFocusTrap(isActive) {
    const containerRef = useRef(null);
    const previousActiveElement = useRef(null);

    useEffect(() => {
        if (!isActive || !containerRef.current) return;

        // Önceki focus'u kaydet
        previousActiveElement.current = document.activeElement;

        // Focus edilebilir elementleri bul
        const getFocusableElements = () => {
            if (!containerRef.current) return [];

            return containerRef.current.querySelectorAll(
                'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
        };

        // İlk elemente focus ver
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }

        // Tab tuşu ile focus trap
        const handleKeyDown = (e) => {
            if (e.key !== 'Tab') return;

            const elements = getFocusableElements();
            if (elements.length === 0) return;

            const firstElement = elements[0];
            const lastElement = elements[elements.length - 1];

            // Shift + Tab ile ilk elementteysen son elemente git
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
            // Tab ile son elementteysen ilk elemente git
            else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);

            // Focus'u önceki elemente geri döndür
            if (previousActiveElement.current) {
                previousActiveElement.current.focus();
            }
        };
    }, [isActive]);

    return containerRef;
}

export default useFocusTrap;
