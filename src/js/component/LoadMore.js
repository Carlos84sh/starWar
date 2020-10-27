import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Context } from "../store/appContext";

const LoadMore = ({ endpoint, next }) => {
	const { actions } = useContext(Context);
	//esta funcino va devolver un boton  en el que va llamar mi función para ir trayendome mas y mas items
	return (
		<div className="card mx-2 bg-light" style={{ minWidth: 314 + "px", width: 314 + "px" }}>
			<div className="d-flex flex-nowrap justify-content-center h-100">
				<button
					className="btn btn-block btn-lg btn-outline-primary"
					onClick={() => actions.fetchItems(endpoint, next)}>
					{`load more ${endpoint}!`}
				</button>
			</div>
		</div>
	);
};

export default LoadMore;

LoadMore.propTypes = {
	endpoint: PropTypes.string,
	next: PropTypes.string
};
