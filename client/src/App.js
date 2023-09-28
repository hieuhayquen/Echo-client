import { Fragment, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "./redux/userSlice/apiCalls";
import { getPlayLists } from "./redux/playListSlice/apiCalls";
import PrivateRoute from "./PrivateRoute";
import Main from "./Pages/Main";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import NotFound from "./Pages/NotFound";
import Home from "./Pages/Home";
import Library from "./Pages/Library";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/NavBar";
import AudioPlayer from "./components/AudioPlayer";
import Playlist from "./Pages/Playlist";
import Search from "./Pages/Search";
import LikedSongs from "./Pages/LikedSongs";
import Profile from "./Pages/Profile";

const App = () => {
	const dispatch = useDispatch();
	const location = useLocation();
	const { user } = useSelector((state) => state.auth);
	const { currentSong } = useSelector((state) => state.audioPlayer);

	useEffect(() => {
		let token = null;
		const root = JSON.parse(window.localStorage.getItem("persist:root"));

		if (root) {
			const { auth } = root;
			const { user } = JSON.parse(auth);
			if (user) token = user.token;
		}

		if (user && token) {
			getUser(user._id, dispatch);
			getPlayLists(dispatch);
		}
	}, [dispatch, user]);

	return (
		<Fragment>
			{user &&
				location.pathname !== "/login" &&
				location.pathname !== "/" &&
				location.pathname !== "/signup" &&
				location.pathname !== "/not-found" && (
					<Fragment>
						<Navbar />
						<Sidebar />
						{currentSong && <AudioPlayer />}
					</Fragment>
				)}
			<Routes>
				<Route path="/" element={<Main />} />
				<Route  element={<PrivateRoute user={user}/>}>
					<Route path="/home" element={<Home/>}/>
					<Route path='/collection/tracks' element={<LikedSongs/>}/>
					<Route path='/collection/playlists' element={<Library/>}/>
					<Route path='/playlist/:id' element={<Playlist/>}/>
					<Route path='/me' element={<Profile/>}/>
					<Route path='/search' element={<Search/>}/>
				</Route>   
				<Route path="/signup" element={<SignUp />} />
				<Route path="/login" element={<Login />} />
				<Route path="/not-found" element={<NotFound />} />
				<Route path="/*" element={
					<Navigate to='/not-found'/>
				}/>
			</Routes>
		</Fragment>
	);
};

export default App;
