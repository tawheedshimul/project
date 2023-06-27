import React, { useState, useRef, useEffect } from 'react';
import { BsPlayFill, BsPauseFill, BsVolumeMuteFill, BsVolumeUpFill } from 'react-icons/bs';
import 'tailwindcss/tailwind.css';

const MusicPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const previousVolume = useRef(volume);

  useEffect(() => {
    const audioElement = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(audioElement.duration);
    };

    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('durationchange', handleDurationChange);

    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('durationchange', handleDurationChange);
    };
  }, []);

  const togglePlay = () => {
    const audioElement = audioRef.current;
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeSeek = (event) => {
    const audioElement = audioRef.current;
    const seekTime = event.target.value;
    audioElement.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (event) => {
    const volumeLevel = event.target.value;
    setVolume(volumeLevel);
    if (!isMuted) {
      audioRef.current.volume = volumeLevel;
    }
  };

  const toggleMute = () => {
    const audioElement = audioRef.current;
    if (isMuted) {
      audioElement.volume = previousVolume.current;
      setVolume(previousVolume.current);
    } else {
      previousVolume.current = volume;
      audioElement.volume = 0;
      setVolume(0);
    }
    setIsMuted(!isMuted);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="text-2xl font-bold mb-4">Music Player</h1>
      <div className="relative w-64">
        <audio ref={audioRef} src="/music.mp3" />
        <div
          className="absolute top-0 left-0 h-1 bg-gray-300"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
        <div className="flex items-center justify-between">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={togglePlay}
          className={`flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-colors duration-300 ${
            isPlaying ? 'bg-red-500 text-white' : 'bg-green-500 text-gray-800'
          } hover:bg-opacity-75`}
        >
          {isPlaying ? <BsPauseFill size={24} /> : <BsPlayFill size={24} />}
        </button>
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleTimeSeek}
          className="w-64 h-2"
        />
        <button
          onClick={toggleMute}
          className={`flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-colors duration-300 ${
            isMuted ? 'bg-red-500 text-white' : 'bg-blue-500 text-gray-800'
          } hover:bg-opacity-75`}
        >
          {isMuted ? <BsVolumeMuteFill size={24} /> : <BsVolumeUpFill size={24} />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={volume}
          onChange={handleVolumeChange}
          className="w-20 h-2"
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
