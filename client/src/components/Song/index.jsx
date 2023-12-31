import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentSong } from "../../redux/audioPlayer";
import Like from "../Like";
import { IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import styles from "./styles.module.scss";
import PlaylistMenu from "../PlaylistMenu";

const Song = ({ song, playlist, handleRemoveSong }) => {
	const [menu, setMenu] = useState(false);
	const { currentSong } = useSelector((state) => state.audioPlayer);
	const dispatch = useDispatch();

	const handleChange = () => {
		if (currentSong && currentSong.action === "play") {
			const payload = {
				song: song,
				action: "pause",
			};
			dispatch(setCurrentSong(payload));
			console.log(currentSong);
		} else {
			const payload = {
				song: song,
				action: "play",
			};
			dispatch(setCurrentSong(payload));
			console.log(currentSong);	
		}
	};

	const calculateTime = (sec) => {
		const minutes = Math.floor(sec / 60);
		const returnMin = minutes < 10 ? `0${minutes}` : `${minutes}`;
		const seconds = Math.floor(sec % 60);
		const returnSec = seconds < 10 ? `0${seconds}` : `${seconds}`;
	return `${returnMin}:${returnSec}`;
	};

	return (
		<div className={styles.song_container}>
			<div className={styles.left}>
				<IconButton onClick={handleChange} className={styles.play_btn}>
					{currentSong &&
					currentSong.action === "play" &&
					currentSong.song._id === song._id ? (
						<PauseIcon />
					) : (
						<PlayArrowIcon />
					)}
				</IconButton>
				<img src={song.img} alt="song_img" />
				<p>{song.name}</p>
			</div>
			<div className={styles.center}>
				<p>{song.artist}</p>
			</div>
			<div className={styles.right}>
				<Like songId={song._id} />
				<p>{calculateTime(song.duration)}</p>
				<IconButton className={styles.menu_btn} onClick={() => setMenu(true)}>
					<MoreHorizIcon />
				</IconButton>
				{menu && (
					<PlaylistMenu
						playlist={playlist}
						song={song}
						handleRemoveSong={handleRemoveSong}
						closeMenu={() => setMenu(false)}
					/>
				)}
			</div>
		</div>
	);
};

export default Song;
