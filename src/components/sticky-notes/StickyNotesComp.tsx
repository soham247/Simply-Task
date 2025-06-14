"use client"
import { StickyNote as StickyNoteType } from '@/types/index';
import { AppwriteException } from 'node-appwrite';
import { useState, useEffect } from 'react'
import StickyNote from './StickyNote';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const LoadingScreen = () => {
  return (
    <div className='mx-auto max-w-7xl mt-8 flex flex-wrap justify-center'>
      {[...Array(6)].map((_, index) => {
        return (
          <div 
            key={index}
            className="relative w-72 h-72 m-4"
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            {/* Main Note Body matching original design */}
            <div 
              className="relative w-full h-full rounded-sm shadow-lg"
            >               
                <div 
                  className="absolute top-0 right-0 w-8 h-8 transform rotate-45 translate-x-4 -translate-y-4"
                  style={{
                    filter: 'brightness(0.85)',
                    clipPath: 'polygon(0 100%, 100% 0, 100% 100%)',
                    boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.3)'
                  }}
                ></div>
                
                <div 
                  className="absolute top-0 right-0 w-12 h-1 transform rotate-45 translate-x-4 -translate-y-1 opacity-30"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    transformOrigin: 'left center'
                  }}
                ></div>
              </div>

              {/* Content Area with Skeletons */}
              <div className="relative p-4 h-full flex flex-col justify-between">
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-6 w-3/4 mx-auto"  />
                  <Skeleton className="h-4 w-full"  />
                  <Skeleton className="h-4 w-5/6 mx-auto"  />
                  <Skeleton className="h-4 w-2/3 mx-auto"  />
                </div>

                {/* Timestamp skeleton */}
                <div className="mt-2">
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>

              {/* Subtle paper lines */}
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
        )
      })}
          </div>
        );
      };


function StickyNotesComp() {
    const [stickyNotes, setStickyNotes] = useState<StickyNoteType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getStickyNotes = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const res = await fetch("/api/sticky-notes", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("Response status:", res.status);
            
            if (res.ok) {
                const data = await res.json();                
                setStickyNotes(data.stickyNotes || []);
            } else {
                const errorData = await res.json();
                setError(errorData.error || 'Failed to fetch notes');
            }
        } catch (error: unknown) {
            console.error("Fetch error:", error);
            if (error instanceof AppwriteException) {
                setError(error.message);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    // Use useEffect, not useState!
    useEffect(() => {
        getStickyNotes();
    }, []);

    if (loading) return <LoadingScreen />

    return (
        <div className='mx-auto max-w-7xl mt-8 lg:p-10'>
            {error && (
                <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
            )}
            {stickyNotes.length === 0 ? (
                <p>No sticky notes found</p>
            ) : (
                <div className='flex flex-wrap justify-center gap-2 lg:gap-5'>
                    {stickyNotes.map((note) => (
                        <StickyNote key={note.$id} StickyNote={note} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default StickyNotesComp;