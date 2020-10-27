import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Context } from "../store/appContext";
import { useHistory } from "react-router-dom";

const ItemCard = ({ nature, item }) => {
	const { store, actions } = useContext(Context);
	const [faved, setFaved] = useState(false);
	const history = useHistory();

	useEffect(
		() => {
			let faved = false;
			//esta funcion lo que hace es comparar lo que hay dentro
			for (let fav of store.favorites) {
				if (fav.globalId == item.globalId) {
					faved = true;
					break;
				}
			}
			setFaved(faved);
		},
		[store.favorites]
	);
	return (
		<div className="card mx-2" style={{ minWidth: 314 + "px", width: 314 + "px" }}>
			<img src="https://via.placeholder.com/400x200" className="card-img-top" alt="..." />
			<div className="card-body">
				{/*Accedo a mi propiedad item y voy a name. */}
				<h5 className="card-title mb-3">{item.name}</h5>
				{/*Dependiente del elemento que sea accedo a sus propiedas para darle funcionalidad dinamica */}
				{nature == "people" ? (
					<>
						<p className="card-text mb-0">{`gender: ${item.gender}`}</p>
						<p className="card-text mb-0">{`hair color: ${item.hair_color}`}</p>
						<p className="card-text">{`eye color: ${item.eye_color}`}</p>
					</>
				) : nature == "planets" ? (
					<>
						<p className="card-text mb-0">{`population: ${item.population}`}</p>
						<p className="card-text">{`terrain: ${item.terrain}`}</p>
					</>
				) : (
					<>
						<p className="card-text mb-0">{`crew: ${item.crew}`}</p>
						<p className="card-text mb-0">{`passengers: ${item.passengers}`}</p>
						<p className="card-text mb-0">{`class: ${item.vehicle_class}`}</p>
						<p className="card-text">{`cargo: ${item.cargo_capacity}`}</p>
					</>
				)}
				<div className="d-flex flex-nowrap justify-content-between">
					{/*Aqui mediante el item.globalId accedo a ese elemento  */}
					<button onClick={() => history.push(`/single/${item.globalId}`)} className="btn btn-primary">
						{"learn more"}
					</button>
					<button
						className="btn btn-outline-warning"
						onClick={() => {
							if (faved) {
								//cuando faved sea true cuando le de clikc le envio el item para eliminarlo.
								actions.removeFavorite(item.globalId);
							} else {
								//si es false lo añado a favorito
								actions.addFavorite(item);
							}
						}}>
						{/*dependiendo de si es true o false va mostrar uno u otro  */}
						{!faved ? <i className="far fa-heart" /> : <i className="fas fa-heart" />}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ItemCard;

ItemCard.propTypes = {
	nature: PropTypes.string,
	item: PropTypes.object
};
