import type { StickyNote as StickyNoteType } from '@/types/index'
import React, { useState } from 'react'

interface StickyNoteProps {
  StickyNote: StickyNoteType
  onDelete?: (id: string) => Promise<void>
}

function StickyNote({ StickyNote, onDelete }: StickyNoteProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showTrash, setShowTrash] = useState(false)

  // Generate random rotation for each note
  const getRandomRotation = () => {
    const rotations = [-3, -2, -1, 0, 1, 2, 3];
    return rotations[Math.floor(Math.random() * rotations.length)];
  };
  
  const getRandomHoverRotation = () => {
    const rotations = [-2, -1, 0, 1, 2];
    return rotations[Math.floor(Math.random() * rotations.length)];
  };

  const baseRotation = React.useMemo(() => getRandomRotation(), []);
  const hoverRotation = React.useMemo(() => getRandomHoverRotation(), []);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isDeleting) return;
    
    setIsDeleting(true);
    
    try {
      // Make API call first
      const res = await fetch(`/api/sticky-notes/${StickyNote.$id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete note');
      }
      
      // Notify parent component if callback provided
      if (onDelete) {
        await onDelete(StickyNote.$id);
      }
      
      // Animation will handle the visual removal
      // The parent component should remove this from the list after animation completes
      setTimeout(() => {
        // This timeout matches the animation duration
        // Parent component should handle actual removal from state
      }, 800);
      
    } catch (error) {
      console.error('Failed to delete note:', error);
      setIsDeleting(false);
    }
  };

  if (isDeleting) {
    return (
      <div 
        className="relative w-72 h-72 m-4 transform transition-all duration-800 ease-in-out animate-pulse"
        style={{
          transform: `rotate(${baseRotation + 15}deg) scale(0.8)`,
          animation: 'peelOff 0.8s ease-in forwards'
        }}
      >
        <style jsx>{`
          @keyframes peelOff {
            0% {
              transform: rotate(${baseRotation}deg) scale(1);
              opacity: 1;
            }
            30% {
              transform: rotate(${baseRotation + 5}deg) scale(1.05) translateY(-10px);
              opacity: 1;
            }
            60% {
              transform: rotate(${baseRotation + 25}deg) scale(0.9) translateY(-20px) translateX(30px);
              opacity: 0.7;
            }
            100% {
              transform: rotate(${baseRotation + 45}deg) scale(0.3) translateY(-100px) translateX(100px);
              opacity: 0;
            }
          }
        `}</style>
        
        <div 
          className="relative w-full h-full rounded-sm shadow-lg"
          style={{
            backgroundColor: StickyNote.color || '#fef08a',
            boxShadow: `
              0 2px 4px rgba(0, 0, 0, 0.1),
              0 8px 16px rgba(0, 0, 0, 0.1),
              0 16px 32px rgba(0, 0, 0, 0.05)
            `,
            borderTop: `3px solid ${StickyNote.color ? 
              `color-mix(in srgb, ${StickyNote.color} 80%, #000 20%)` : 
              '#e6d000'}`
          }}
        >
          {/* Simplified content during animation */}
          <div className="relative p-4 h-full flex flex-col justify-center">
            <p className="text-gray-800 text-center text-lg font-caveat leading-relaxed break-words whitespace-pre-wrap opacity-70">
              {StickyNote.content}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-72 h-72 m-4 transform transition-transform duration-300 ease-in-out group"
      style={{
        transform: `rotate(${baseRotation}deg)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `rotate(${hoverRotation}deg)`;
        setShowTrash(true);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${baseRotation}deg)`;
        setShowTrash(false);
      }}
    >
      {/* Trash Icon */}
      <div 
        className={`absolute -top-2 -right-2 z-20 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 hover:bg-red-600 hover:scale-110 ${
          showTrash ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
        onClick={handleDelete}
        style={{
          transform: `rotate(-${baseRotation}deg)`, // Counter-rotate to keep icon upright
        }}
      >
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="3,6 5,6 21,6"></polyline>
          <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </div>

      {/* Main Note Body with sticky top edge */}
      <div 
        className="relative w-full h-full rounded-sm shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer"
        style={{
          backgroundColor: StickyNote.color || '#fef08a',
          boxShadow: `
            0 2px 4px rgba(0, 0, 0, 0.1),
            0 8px 16px rgba(0, 0, 0, 0.1),
            0 16px 32px rgba(0, 0, 0, 0.05)
          `,
          transformOrigin: 'top center',
          // Make the top edge look sticky/adhesive
          borderTop: `3px solid ${StickyNote.color ? 
            `color-mix(in srgb, ${StickyNote.color} 80%, #000 20%)` : 
            '#e6d000'}`
        }}
      >
        {/* Paper texture overlay */}
        <div 
          className="absolute inset-0 rounded-sm opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(0,0,0,0.05) 0%, transparent 50%)
            `
          }}
        ></div>

        {/* Realistic Folded Corner */}
        <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
          {/* Main fold triangle */}
          <div 
            className="absolute top-0 right-0 w-10 h-10 transform rotate-45 translate-x-5 -translate-y-5"
            style={{
              backgroundColor: StickyNote.color || '#fef08a',
              filter: 'brightness(0.7) saturate(1.2)',
              boxShadow: `
                inset -3px -3px 6px rgba(0, 0, 0, 0.2),
                2px 2px 4px rgba(0, 0, 0, 0.1)
              `
            }}
          ></div>
          
          {/* Inner fold highlight */}
          <div 
            className="absolute top-0 right-0 w-8 h-8 transform rotate-45 translate-x-4 -translate-y-4"
            style={{
              backgroundColor: StickyNote.color || '#fef08a',
              filter: 'brightness(0.85)',
              clipPath: 'polygon(0 100%, 100% 0, 100% 100%)',
              boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.3)'
            }}
          ></div>
          
          {/* Fold crease line */}
          <div 
            className="absolute top-0 right-0 w-12 h-1 transform rotate-45 translate-x-4 -translate-y-1 opacity-30"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              transformOrigin: 'left center'
            }}
          ></div>
        </div>

        {/* Content Area */}
        <div className="relative p-4 h-full flex flex-col justify-between">
          {/* Note Content */}
          <div className="flex-1">
            <p className="text-gray-800 text-center text-xl font-caveat leading-relaxed break-words whitespace-pre-wrap">
              {StickyNote.content}
            </p>
          </div>

          {/* Timestamp */}
          <div className="mt-2 text-xs text-gray-300 opacity-70">
            {new Date(StickyNote.$createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        {/* Subtle paper lines (optional) */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute left-4 right-4 border-t border-gray-400"
              style={{ top: `${20 + i * 24}px` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Drop shadow for lifted bottom effect */}
      <div 
        className="absolute bottom-0 left-4 right-4 h-2 rounded-sm -z-10 transform translate-y-1"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
          filter: 'blur(6px)',
          transformOrigin: 'bottom center'
        }}
      ></div>
    </div>
  )
}

export default StickyNote