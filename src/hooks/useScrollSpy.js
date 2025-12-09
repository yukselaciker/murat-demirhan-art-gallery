// ============================================
// USE SCROLL SPY HOOK - MURAT DEMİRHAN PORTFOLYO
// Intersection Observer ile aktif section takibi
// ============================================

import { useState, useEffect } from 'react';

export function useScrollSpy(sectionIds, options = {}) {
    const [activeId, setActiveId] = useState('');

    const {
        rootMargin = '-20% 0px -80% 0px', // Viewport'un üst kısmında aktif
        threshold = 0
    } = options;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin, threshold }
        );

        // Tüm section'ları gözlemle
        sectionIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            sectionIds.forEach((id) => {
                const element = document.getElementById(id);
                if (element) {
                    observer.unobserve(element);
                }
            });
        };
    }, [sectionIds, rootMargin, threshold]);

    return activeId;
}

export default useScrollSpy;
