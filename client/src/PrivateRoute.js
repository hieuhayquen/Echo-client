import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ( { user, ...rest }) => {
	const { currentSong } = useSelector((state) => state.audioPlayer);

	const isAuth = user && !user.isAdmin;

	const styles = {
		padding: currentSong ? "6rem 0 10rem 26rem" : "6rem 0 0 26rem",
		backgroundColor: "#181818",
		color: "#ffffff",
		minHeight: "calc(100vh - 6rem)",
	};

	return isAuth ? <div style={styles}><Outlet/></div> : <Navigate to="/login" />;
};

export default PrivateRoute;
