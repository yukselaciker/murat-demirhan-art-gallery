// ============================================
// POST CARD - Feed Post Display Component
// Shows post content, images, and reaction bar
// ============================================

import { useState, memo, useCallback } from 'react';
import { EMOJI_MAP, reactToPost, getImageUrl } from '../../lib/feedApi';
import './PostCard.css';

/**
 * Single post card with content and reactions
 * @param {{post: import('../../lib/feedApi').Post, onReactionUpdate?: (postId: string, emoji: string, newCount: number) => void}} props
 */
function PostCard({ post, onReactionUpdate }) {
    const [reactions, setReactions] = useState(post.reactions);
    const [reactedEmojis, setReactedEmojis] = useState({});
    const [isReacting, setIsReacting] = useState({});
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Format date
    const formattedDate = new Date(post.createdAt).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Handle emoji reaction click
    const handleReaction = useCallback(async (emoji) => {
        if (reactedEmojis[emoji] || isReacting[emoji]) return;

        // Optimistic update
        setIsReacting(prev => ({ ...prev, [emoji]: true }));
        setReactions(prev => ({
            ...prev,
            [emoji]: prev[emoji] + 1
        }));

        try {
            const result = await reactToPost(post.id, emoji);

            if (result.alreadyReacted) {
                // Rollback optimistic update
                setReactions(prev => ({
                    ...prev,
                    [emoji]: prev[emoji] - 1
                }));
                // Mark as already reacted
                setReactedEmojis(prev => ({ ...prev, [emoji]: true }));
            } else if (result.success) {
                // Update with actual count
                setReactions(prev => ({
                    ...prev,
                    [emoji]: result.count
                }));
                setReactedEmojis(prev => ({ ...prev, [emoji]: true }));

                // Notify parent of update
                if (onReactionUpdate) {
                    onReactionUpdate(post.id, emoji, result.count);
                }
            }
        } catch (error) {
            // Rollback on error
            setReactions(prev => ({
                ...prev,
                [emoji]: prev[emoji] - 1
            }));
            console.error('Reaction failed:', error);
        } finally {
            setIsReacting(prev => ({ ...prev, [emoji]: false }));
        }
    }, [post.id, reactedEmojis, isReacting, onReactionUpdate]);

    // Image carousel navigation
    const nextImage = useCallback(() => {
        setCurrentImageIndex(prev =>
            prev < post.images.length - 1 ? prev + 1 : 0
        );
    }, [post.images.length]);

    const prevImage = useCallback(() => {
        setCurrentImageIndex(prev =>
            prev > 0 ? prev - 1 : post.images.length - 1
        );
    }, [post.images.length]);

    const hasMultipleImages = post.images && post.images.length > 1;

    return (
        <article className="post-card">
            {/* Date */}
            <time className="post-date" dateTime={post.createdAt}>
                {formattedDate}
            </time>

            {/* Title */}
            {post.title && (
                <h3 className="post-title">{post.title}</h3>
            )}

            {/* Body */}
            {post.body && (
                <p className="post-body">{post.body}</p>
            )}

            {/* Images */}
            {post.images && post.images.length > 0 && (
                <div className={`post-images ${hasMultipleImages ? 'carousel' : ''}`}>
                    <img
                        src={getImageUrl(post.images[currentImageIndex])}
                        alt={post.title || 'Güncelleme görseli'}
                        className="post-image"
                        loading="lazy"
                    />

                    {hasMultipleImages && (
                        <>
                            <button
                                className="carousel-btn prev"
                                onClick={prevImage}
                                aria-label="Önceki görsel"
                            >
                                ‹
                            </button>
                            <button
                                className="carousel-btn next"
                                onClick={nextImage}
                                aria-label="Sonraki görsel"
                            >
                                ›
                            </button>
                            <div className="carousel-dots">
                                {post.images.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                        aria-label={`Görsel ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Reaction Bar */}
            <div className="reaction-bar" role="group" aria-label="Tepkiler">
                {Object.entries(EMOJI_MAP).map(([key, emoji]) => (
                    <button
                        key={key}
                        className={`reaction-btn ${reactedEmojis[key] ? 'reacted' : ''} ${isReacting[key] ? 'reacting' : ''}`}
                        onClick={() => handleReaction(key)}
                        disabled={reactedEmojis[key] || isReacting[key]}
                        aria-label={`${key} tepkisi (${reactions[key]})`}
                        aria-pressed={reactedEmojis[key]}
                    >
                        <span className="emoji" aria-hidden="true">{emoji}</span>
                        <span className="count">{reactions[key]}</span>
                    </button>
                ))}
            </div>
        </article>
    );
}

export default memo(PostCard);
