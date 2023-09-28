import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentSong, setIsRepeatFalse, setIsRepeatTrue } from "../../redux/audioPlayer";
import Like from "../Like";
import { IconButton } from "@mui/material";
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import styles from "./styles.module.scss";

const AudioPlayer = () => {
	const [trackProgress, setTrackProgress] = useState(0);
	const [duration, setDuration] = useState(0);
	const { currentSong } = useSelector((state) => state.audioPlayer);
	const { currentPlaylist } = useSelector((state) => state.audioPlayer);
	const { isRepeat } = useSelector((state) => state.audioPlayer);
	const dispatch = useDispatch();

	const audioRef = useRef();
	const intervalRef = useRef();
	
	const calculateTime = (sec) => {
		const minutes = Math.floor(sec / 60);
		const returnMin = minutes < 10 ? `0${minutes}` : `${minutes}`;
		const seconds = Math.floor(sec % 60);
		const returnSec = seconds < 10 ? `0${seconds}` : `${seconds}`;
	return `${returnMin}:${returnSec}`;
	};

	const startTimer = () => {
		clearInterval(intervalRef.current);

		intervalRef.current = setInterval(() => {
			const index = currentPlaylist.indexOf(currentSong.song);
			if (audioRef && audioRef.current.ended) {
				if (isRepeat === true) {
					dispatch(setCurrentSong({ ...currentSong, action: "play" }));
					dispatch(setIsRepeatFalse());
				} else if (index === currentPlaylist.length-1 || index === -1) {
					const payload = {
						song : currentPlaylist[0],
						action: "play",
					}
					dispatch(setCurrentSong(payload));
				} else {
					const payload = {
						song : currentPlaylist[index+1],
						action: "play",
					}
					dispatch(setCurrentSong(payload));
				}
			} else if (audioRef) {
				setTrackProgress(audioRef.current.currentTime);
				audioRef.current.duration && setDuration(audioRef.current.duration);
			} else {
				setTrackProgress(0);
			}
		}, [1000]);
	};

	const currentPercentage = duration
		? `${(trackProgress / duration) * 100}%`
		: "0%";
	const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #fff), color-stop(${currentPercentage}, #777))
  `;

	useEffect(() => {
		if (currentSong.action === "play") {
			audioRef.current.play();
		} else {
			audioRef.current.pause();
		}
	}, [currentSong]);

	useEffect(() => {
		currentSong.action === "play" && startTimer();
	});

	const onScrub = (value) => {
		clearInterval(intervalRef.current);
		audioRef.current.currentTime = value;
		setTrackProgress(audioRef.current.currentTime);
	};

	const handleActions = () => {
		currentSong.action === "play"
			? dispatch(setCurrentSong({ ...currentSong, action: "pause" }))
			: dispatch(setCurrentSong({ ...currentSong, action: "play" }));
	};

	const handleNextSong = () => {
		if (currentSong) {
			const index = currentPlaylist.indexOf(currentSong.song);
			if (index === currentPlaylist.length-1 || index === -1) {
				const payload = {
					song : currentPlaylist[0],
					action: "play",
				}
				dispatch(setCurrentSong(payload));
			} else {
				const payload = {
					song : currentPlaylist[index+1],
					action: "play",
				}
				dispatch(setCurrentSong(payload));
			}
		}
	};
	
	const handlePreviousSong = () => {
		if (currentSong) {
			const index = currentPlaylist.indexOf(currentSong.song);
			if (index === 0 || index === -1) {
				const payload = {
					song : currentPlaylist[currentPlaylist.length - 1],
					action: "play",
				}
				dispatch(setCurrentSong(payload));
			} else {
				const payload = {
					song : currentPlaylist[index-1],
					action: "play",
				}
				dispatch(setCurrentSong(payload));
			}
		}
	};

	const handleRandomSong = () => {
		if (currentSong) {
			const randomIndex = Math.floor(Math.random() * currentPlaylist.length);
			const payload = {
				song : currentPlaylist[randomIndex],
				action: "play",
			}
			dispatch(setCurrentSong(payload));
		}
	}

	const handleRepeat = () => {
		isRepeat === false 
			? dispatch(setIsRepeatTrue())
			: dispatch(setIsRepeatFalse());
	}

	return (
		<div className={styles.audio_player}>
			<div className={styles.left}>
				<img src={currentSong.song.img} alt="song_img" />
				<div className={styles.song_info}>
					<p className={styles.song_name}>{currentSong.song.name}</p>
					<p className={styles.song_artist}>{currentSong.song.artist}</p>
				</div>
			</div>
			<div className={styles.center}>
				<div className={styles.audio_controls}>
					<IconButton className={styles.prev} onClick={handleRandomSong}>
						<ShuffleIcon />
					</IconButton>
					<IconButton className={styles.prev} onClick={handlePreviousSong}>
						<SkipPreviousIcon />
					</IconButton>
					<IconButton className={styles.play} onClick={handleActions}>
						{currentSong.action === "play" ? <PauseIcon /> : <PlayArrowIcon />}
					</IconButton>
					<IconButton className={styles.next} onClick={handleNextSong}>
						<SkipNextIcon />
					</IconButton>
					<IconButton className={styles.next} onClick={handleRepeat}>
						{isRepeat === false ? <RepeatIcon /> : <RepeatOneIcon />}
					</IconButton>
				</div>
				<div className={styles.progress_container}>
					<p>{calculateTime(trackProgress)}</p>
					<input
						type="range"
						value={trackProgress}
						step="1"
						min="0"
						onChange={(e) => onScrub(e.target.value)}
						max={duration ? duration : 0}
						className={styles.progress}
						style={{ background: trackStyling }}
					/>
					<audio src={currentSong.song.song} ref={audioRef}></audio>
					<p>{calculateTime(duration)}</p>
				</div>
			</div>
			<div className={styles.right}>
				<Like songId={currentSong.song._id} />
			</div>
		</div>
	);
};

export default AudioPlayer;
