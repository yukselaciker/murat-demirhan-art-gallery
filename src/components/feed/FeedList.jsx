// ============================================
// FEED LIST - Public Updates/Feed Component
// Displays all published posts with loading states
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { fetchPosts } from '../../lib/feedApi';
import PostCard from './PostCard';
import './FeedList.css';

/**
 * Main feed list component
 */
export default function FeedList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch posts on mount
    useEffect(() => {
        const loadPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchPosts();
                setPosts(data);
            } catch (err) {
                setError(err.message || 'Güncellemeler yüklenemedi');
                console.error('Failed to load posts:', err);
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, []);

    // Handle reaction update from child
    const handleReactionUpdate = useCallback((postId, emoji, newCount) => {
        setPosts(prev => prev.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    reactions: {
                        ...post.reactions,
                        [emoji]: newCount
                    }
                };
            }
            return post;
        }));
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="feed-container">
                <div className="feed-loading">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="skeleton-card">
                            <div className="skeleton-line short"></div>
                            <div className="skeleton-line"></div>
                            <div className="skeleton-line"></div>
                            <div className="skeleton-image"></div>
                            <div className="skeleton-reactions">
                                <div className="skeleton-reaction"></div>
                                <div className="skeleton-reaction"></div>
                                <div className="skeleton-reaction"></div>
                                <div className="skeleton-reaction"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="feed-container">
                <div className="feed-error">
                    <span className="error-icon">⚠️</span>
                    <p>{error}</p>
                    <button
                        className="btn retry-btn"
                        onClick={() => window.location.reload()}
                    >
                        Tekrar Dene
                    </button>
                </div>
            </div>
        );
    }

    // Empty state
    if (posts.length === 0) {
        return (
            <div className="feed-container">
                <div className="feed-empty">
                    <span className="empty-icon">📝</span>
                    <h3>Henüz güncelleme yok</h3>
                    <p>Sanatçıdan güncellemeler burada görünecek.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="feed-container">
            <div className="feed-list">
                {posts.map(post => (
                    <PostCard
                        key={post.id}
                        post={post}
                        onReactionUpdate={handleReactionUpdate}
                    />
                ))}
            </div>
        </div>
    );
}
