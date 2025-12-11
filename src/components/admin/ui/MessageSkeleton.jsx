import React from 'react';
import { Skeleton } from './Skeleton';
import { Card } from './Card';

export const MessageSkeleton = () => {
    return (
        <Card noPadding>
            <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Skeleton width="40%" height="20px" />
                    <Skeleton width="20%" height="16px" />
                </div>
                <Skeleton width="60%" height="16px" />
                <div style={{ marginTop: '8px' }}>
                    <Skeleton width="100%" height="14px" />
                    <Skeleton width="90%" height="14px" style={{ marginTop: '4px' }} />
                </div>
            </div>
        </Card>
    );
};
