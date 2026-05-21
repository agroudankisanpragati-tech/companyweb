'use client';

import { FaFacebookF, FaLinkedinIn, FaXTwitter, FaLink } from 'react-icons/fa6';

interface ShareButtonsProps {
    url: string;
    title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
    const handleCopyLink = () => {
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
    };

    return (
        <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.18)] backdrop-blur-md md:gap-2 md:p-2">
            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/90 text-white transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg md:h-10 md:w-10"
                title="Share on Facebook"
            >
                <FaFacebookF size={15} />
            </a>
            <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/90 text-white transition duration-300 hover:-translate-y-0.5 hover:bg-black hover:shadow-lg md:h-10 md:w-10"
                title="Share on Twitter"
            >
                <FaXTwitter size={15} />
            </a>
            <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-700/90 text-white transition duration-300 hover:-translate-y-0.5 hover:bg-sky-800 hover:shadow-lg md:h-10 md:w-10"
                title="Share on LinkedIn"
            >
                <FaLinkedinIn size={15} />
            </a>
            <button
                onClick={handleCopyLink}
                className="group inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600/90 text-white transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg md:h-10 md:w-10"
                title="Copy link"
            >
                <FaLink size={14} />
            </button>
        </div>
    );
}
