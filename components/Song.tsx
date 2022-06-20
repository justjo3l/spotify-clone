import { time } from "console";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState, nextTrackIdState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../lib/time";

function Song({ order, track, playlist }: { order:any, track:any, playlist:any }) {

    const spotifyApi = useSpotify();

    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [nextTrackId, setNextTrackId] = useRecoilState(nextTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const playSong = () => {
        setCurrentTrackId(track.track.id);
        let playlistItems = [];
        for (var i = 0; i < playlist.tracks.items.length; i++) {
            playlistItems.push(playlist.tracks.items[i].track.id);
        }
        console.log(playlistItems[playlistItems.indexOf(track.track.id) + 1]);
        setNextTrackId(playlistItems[playlistItems.indexOf(track.track.id) + 1]);
        setIsPlaying(true);
        spotifyApi.play({
            uris: [track.track.uri],
        });
    }
    

  return (
    <div className="grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer" onClick={playSong}>
        <div className="flex items-center space-x-4">
            <p>{order + 1}</p>
            <img className="h-10 w-10" src={track.track.album.images[0].url} alt="" />
            <div>
                <p className="w-36 lg:w-64 text-white truncate">{track.track.name}</p>
                <p className="w-40">{track.track.artists[0].name}</p>
            </div>
        </div>

        <div className="flex items-center justify-between ml-auto md:ml-0">
            <p className="w-40 hidden md:inline">{track.track.album.name}</p>
            <p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
        </div>
    </div>
  )
}

export default Song