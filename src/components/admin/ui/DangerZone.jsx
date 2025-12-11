import React from 'react';
import { Button } from './Button';
import { Card } from './Card';

export const DangerZone = ({ title, description, actionText, onAction, className = '' }) => {
    return (
        <Card
            className={className}
            style={{
                borderColor: 'var(--color-danger)',
                backgroundColor: 'var(--color-danger-bg)',
                boxShadow: 'none'
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <h4 style={{ color: 'var(--color-danger)', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
                        {title}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
                        {description}
                    </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="destructive" onClick={onAction}>
                        {actionText}
                    </Button>
                </div>
            </div>
        </Card>
    );
};
