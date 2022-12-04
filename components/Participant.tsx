import React, { useState, useEffect, useRef } from "react"
import styles from "../styles/Participant.module.css"

export const Participant: React.FC<any> = ({ participant }) => {
    const [videoTracks, setVideoTracks] = useState<any[]>([])
    const [audioTracks, setAudioTracks] = useState<any[]>([])

    const videoRef = useRef<any>()
    const audioRef = useRef<any>()

    const trackpubsToTracks = (trackMap: any[]) =>
        Array.from(trackMap.values())
            .map((publication) => publication.track)
            .filter((track) => track !== null)

    useEffect(() => {
        setVideoTracks(trackpubsToTracks(participant.videoTracks))
        setAudioTracks(trackpubsToTracks(participant.audioTracks))

        const trackSubscribed = (track: { kind: string; }) => {
            if (track.kind === "video") {
                setVideoTracks((videoTracks) => [...videoTracks, track])
            } else if (track.kind === "audio") {
                setAudioTracks((audioTracks) => [...audioTracks, track])
            }
        }

        const trackUnsubscribed = (track: { kind: string; }) => {
            if (track.kind === "video") {
                setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track))
            } else if (track.kind === "audio") {
                setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track))
            }
        }

        participant.on("trackSubscribed", trackSubscribed)
        participant.on("trackUnsubscribed", trackUnsubscribed)

        return () => {
            setVideoTracks([])
            setAudioTracks([])
            participant.removeAllListeners()
        }
    }, [participant])

    useEffect(() => {
        const videoTrack = videoTracks[0]
        if (videoTrack) {
            videoTrack.attach(videoRef.current)
            return () => {
                videoTrack.detach()
            }
        }
    }, [videoTracks])

    useEffect(() => {
        const audioTrack = audioTracks[0]
        if (audioTrack) {
            audioTrack.attach(audioRef.current)
            return () => {
                audioTrack.detach()
            }
        }
    }, [audioTracks])

    return (
        <div className="participant">
            <video ref={videoRef} autoPlay={true} className={styles.video} />
            <audio ref={audioRef} autoPlay={true} muted={true} />
        </div>
    )
}

export default Participant

