import { useSiteData } from '../data/siteData';
import { getPublicImageUrl } from '../lib/imageUrl';
import { useEffect, useState } from 'react';

export function DebugImageList() {
    const { data } = useSiteData();
    const [artworks, setArtworks] = useState([]);

    useEffect(() => {
        if (data?.artworks) {
            setArtworks(data.artworks.slice(0, 5)); // Just take first 5
        }
    }, [data]);

    if (!artworks.length) return <div className="p-4">Loading debug data...</div>;

    return (
        <div className="debug-list" style={{ padding: '20px', background: '#f5f5f5', zIndex: 9999, position: 'relative' }}>
            <h2>Debug Image List</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {artworks.map((artwork) => {
                    const rawFn = artwork.imageUrl || artwork.image || artwork.thumbnail;
                    const src = getPublicImageUrl(rawFn);

                    return (
                        <div key={artwork.id} style={{ border: '2px solid red', padding: '10px', background: 'white' }}>
                            <div style={{ marginBottom: '10px', fontSize: '12px', wordBreak: 'break-all' }}>
                                <strong>Title:</strong> {artwork.title}<br />
                                <strong>Raw Field:</strong> {JSON.stringify(rawFn)}<br />
                                <strong>Computed Src:</strong> {src}
                            </div>
                            <img
                                src={src}
                                alt={artwork.title}
                                style={{ maxWidth: '200px', display: 'block', border: '1px solid blue' }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default DebugImageList;
