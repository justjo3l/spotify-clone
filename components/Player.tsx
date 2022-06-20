import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import useSongInfo from "../hooks/useSongInfo";
import { HeartIcon, VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline";
import { FastForwardIcon, PauseIcon, PlayIcon, ReplyIcon, RewindIcon, VolumeUpIcon, SwitchHorizontalIcon } from "@heroicons/react/solid";
import { debounce } from "lodash";

function Player() {
    const spotifyApi = useSpotify();
    const { data:session, status } = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(50);

    const songInfo:any = useSongInfo();

    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then((data:any) => {
                console.log("Now playing: ", data.body?.item);
                setCurrentTrackId(data.body?.item?.id);

                spotifyApi.getMyCurrentPlaybackState((data:any) => {
                    setIsPlaying(data.body?.is_playing);
                });
            });
        }
    };

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data:any) => {
            if (data?.body?.is_playing) {
                spotifyApi.pause();
                setIsPlaying(false);
            } else {
                spotifyApi.play();
                setIsPlaying(true);
            }
        })
    };

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong();
            setVolume(50);
        }
    }, [currentTrackId, spotifyApi, session]);
    
    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debouncedAdjustVolume(volume);
        }
    }, [volume]);
    
    const debouncedAdjustVolume = useCallback(
      debounce((volume) => {
        spotifyApi.setVolume(volume).catch((err:any) => {});
      }, 200), []
    );
    

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
        {/* Left */}
        <div className="flex items-center space-x-4">
            <img className="hidden md:inline h-10 w-10" src={songInfo?.album.images[0]?.url} alt="" />
            <div>
                <h3>{songInfo?.name}</h3>
                <p>{songInfo?.artists[0]?.name}</p>
            </div>
        </div>

        {/* Center */}
        <div className="flex items-center justify-evenly">
            <SwitchHorizontalIcon className="playerButton" />
            <RewindIcon className="playerButton" /*onClick = {() => spotifyApi.skipToPrevious()}*//>

            {isPlaying 
            ? ( <PauseIcon className="playerButton w-10 h-10" onClick={handlePlayPause}/>) 
            : ( <PlayIcon className="playerButton w-10 h-10" onClick={handlePlayPause}/>)}

            <FastForwardIcon className="playerButton" /*onClick = {() => spotifyApi.skipToNext()}*//>
            <ReplyIcon className="playerButton" />
        </div>

        {/* Right */}
        <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
            <VolumeDownIcon onClick={() => volume > 0 && setVolume(volume - 10)} className="playerButton"/>
                <input className="w-14 md:w-28" type="range" value={volume} min={0} max={100} onChange={e => setVolume(Number(e.target.value))}/>
            <VolumeUpIcon onClick={() => volume < 100 && setVolume(volume + 10)} className="playerButton"/>
        </div>
    </div>
  )
}

export default Player