// ============================================
// UPDATES SECTION - Public Feed Page/Section
// Integrates into main site
// ============================================

import FeedList from '../feed/FeedList';
import './Updates.css';

/**
 * Updates/Feed section for the main site
 */
export default function Updates() {
    return (
        <section id="updates" className="updates-section">
            <div className="updates-header">
                <h2>Güncellemeler</h2>
                <p className="updates-subtitle">
                    Atölyeden haberler, yeni eserler ve sanatsal yolculuk
                </p>
            </div>

            <FeedList />
        </section>
    );
}
