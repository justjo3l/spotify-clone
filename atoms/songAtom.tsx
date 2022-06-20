import { atom } from "recoil";

export const currentTrackIdState = atom({
    key: "currentTrackIdState",
    default: null,
});

export const nextTrackIdState = atom({
    key: "nextTrackIdState",
    default: null,
});

export const isPlayingState = atom({
    key: "isPlayingState",
    default: false,
});