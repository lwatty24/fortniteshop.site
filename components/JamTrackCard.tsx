import { motion } from 'framer-motion';
import { Play, Pause, Volume2 } from 'lucide-react';
import { ShopItem } from '../types';
import { useState, useRef } from 'react';
import { rarityColors } from '../constants/rarity';
import { RarityPulse } from './RarityPulse';

interface JamTrackCardProps {
  item: ShopItem;
  onClick: () => void;
  isRefreshing?: boolean;
}

export function JamTrackCard({ item: jamTrack, onClick, isRefreshing }: JamTrackCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rarity = rarityColors[jamTrack.rarity.toLowerCase()];

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: isRefreshing ? 1 : 1.02 }}
      whileTap={{ scale: isRefreshing ? 1 : 0.98 }}
      className={`group cursor-pointer ${rarity.glow} transition-all duration-300 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}
      onClick={isRefreshing ? undefined : onClick}
    >
      <div className={`relative rounded-xl bg-gradient-to-br ${rarity.gradient} p-[1.5px] overflow-hidden`}>
        <RarityPulse color={rarity.color} />
        <div className={`relative bg-white dark:bg-black/95 rounded-xl`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${rarity.gradient} opacity-[0.03]`} />
          
          <div className="relative z-10 p-3">
            <div className="aspect-square rounded-lg overflow-hidden mb-3 relative group">
              <img 
                src={jamTrack.featuredImage || jamTrack.image} 
                alt={jamTrack.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={handlePlayPause}
                  className="p-4 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-black dark:text-white truncate">{jamTrack.name}</h3>
                <div className="flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded-lg">
                  <img 
                    src="https://fortnite-api.com/images/vbuck.png"
                    alt="V-Bucks"
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-bold text-blue-500 dark:text-blue-300">
                    {jamTrack.price.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-black/50 dark:text-white/50" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-full appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {jamTrack.previewAudio && (
            <audio
              ref={audioRef}
              src={jamTrack.previewAudio}
              onEnded={() => setIsPlaying(false)}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
} 