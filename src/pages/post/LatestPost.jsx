import React from 'react'
import { useEffect, useState } from 'react';

import axios from '../../utils/axiosInstance.js';
import { useNavigate } from 'react-router-dom';

import { toastSuccess, toastError } from '../../utils/toastMessages.js';
import SanitizedContent from '../../component/quill/SanitizedContent.jsx';
import Skeleton from 'react-loading-skeleton';

const LatestPost = () => {
    const [latestPosts, setLatestPosts] = useState([]);

    const [loading, setLoading] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [postfileKeys, setPostFileKeys] = useState({})
    const [postfileUrls, setPostfileUrls] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        const fetchLatestPosts = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/posts/features/latest-posts');
                const data = response.data.data;
                const files = data.reduce((acc, post) => {
                    acc[post._id] = post.file?.key || '';
                    return acc;
                }, {});
                setPostFileKeys(files);
                const imageRequests = data.map(async (post) => {
                    if (post.file?.key) {
                        try {
                            const imageResponse = await axios.get(`/file/signed-url?key=${post.file.key}`);
                            setPostfileUrls(imageResponse.data.data.url)
                            return { ...post, signedUrl: imageResponse.data.data.url }
                        } catch (err) {
                            console.error("Failed to fetch signed URL:", err);
                            return post;
                        }
                    }
                    return post;
                });
    
                const postsWithImages = await Promise.all(imageRequests);
                setLatestPosts(postsWithImages);
                toastSuccess("Latest posts loaded successfully");
            } catch (error) {
                toastError(error.message || "Failed to fetch latest posts");
            } finally {
                setLoading(false);
            }
        };
        fetchLatestPosts();
    }, []);
    

  return (

    <div className="bg-white border border-gray-200 rounded-lg p-4">
        {loading ? (
            <Skeleton width='8rem' height='1.5rem' className='mb-4'/>
        ) : (
            <h5 className="text-lg font-bold tracking-tight text-gray-900 mb-4">Latest Posts</h5>
        )}
        <div className="space-y-4">
            {loading? (
            Array(2).fill(0).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                <div className="h-14 w-14 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
                </div>
            ))
            ) : (
                latestPosts.map((post) => (
                    <div key={post._id} className="flex items-center space-x-4">
                        <img
                            className="cardImage"
                            src={post.signedUrl || post.file}
                            alt="Latest Post"
                            onClick={() => navigate(`/posts/${post?._id}`)}
                            onLoad={() => setImagesLoaded(true)}
                            loading='lazy'
                        />
                        <div className="flex-1 w-full overflow-hidden">
                            <h6 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:underline" onClick={() => navigate(`/posts/${post?._id}`)}>
                            <SanitizedContent
                                htmlContent={post.title}
                                allowedTags={['h1', 'strong', 'font']}
                            />
                            </h6>
                            <p className="text-xs text-gray-600 line-clamp-1">
                            <SanitizedContent
                                htmlContent={post.description}
                                allowedTags={['h1', 'strong', 'font']}
                            />
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
    
  )
}

export default LatestPost