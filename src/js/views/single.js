import React, { useEffect, useContext, useState } from "react";
import PropTypes from "prop-types";
import { Link, useParams, useRouteMatch } from "react-router-dom";
import { Context } from "../store/appContext";

export const Single = props => {
	const { store, actions } = useContext(Context);
	let { globalId } = useParams();
	const [single, setSingle] = useState({});
	const [faved, setFaved] = useState(false);
	useEffect(
		() => {
			let [endpoint, id] = globalId.split("-");
			console.log("running effect");
			if ("globalId" in store.single) {
				// object in single, verify it is the same
				if (store.single.globalId != globalId) {
					// different object in single fetch
					actions.fetchItem(endpoint, id);
				} else {
					setSingle(store.single);
				}
			} else {
				// no object in single, fetch
				actions.fetchItem(endpoint, id);
			}
			return () => {
				console.log("running cleanup");
			};
		},
		[store.single.globalId, globalId]
	);
	useEffect(
		() => {
			let isFaved = false;
			for (let fav of store.favorites) {
				if (fav.globalId == globalId) {
					isFaved = true;
					break;
				}
			}
			setFaved(isFaved);
		},
		[store.favorites, globalId]
	);
	return (
		<React.Fragment>
			{"name" in single && (
				<div className="container">
					<div className="row flex-wrap mt-md-5">
						<div className="col-md-6 p-0">
							<div
								className="image-holder"
								style={{
									backgroundImage: `url("https://via.placeholder.com/300x200")`,
									backgroundRepeat: "no-repeat",
									backgroundPosition: "center",
									backgroundSize: "cover"
								}}
							/>
						</div>

						<div className="col-md-6 mt-3 mt-md-0 pl-md-4">
							<h1 className="display-3">{single.name}</h1>
							<p>
								{
									"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
								}
							</p>
						</div>
					</div>
					<hr className="my-4" />
					<div className="row flex-wrap justify-content-center">
						{Object.entries(single).map(([key, value], index) => {
							if (
								value != "" &&
								key != "created" &&
								key != "edited" &&
								key != "id" &&
								key != "globalId" &&
								key != "name"
							) {
								if (value.toString().search("http") == -1) {
									return (
										<div key={index} className="item-attr">
											<h5 className="text-center">{key.toString().replace(/_/g, " ")}</h5>
											<hr className="my-1" />
											<p className="mb-0 text-center">{value}</p>
										</div>
									);
								}
							}
						})}
					</div>
					<div className="row justify-content-center">
						<button
							className="my-5 btn btn-warning btn-lg"
							type="button"
							onClick={e => {
								if (faved) {
									actions.removeFavorite(globalId);
								} else {
									actions.addFavorite(store.single);
								}
							}}>
							{faved ? "remove from favorites!" : "add to favorites!"}
						</button>
						<Link to="/" className="mx-3">
							<button className="my-5 btn btn-primary btn-lg" type="button">
								{"back home"}
							</button>
						</Link>
					</div>
				</div>
			)}
		</React.Fragment>
	);
};

Single.propTypes = {
	match: PropTypes.object
};
