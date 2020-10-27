import React, { useContext } from "react";
import "../../styles/home.scss";
import { Context } from "../store/appContext";
import ItemCard from "../component/ItemCard";
import LoadMore from "../component/LoadMore";

export const Home = () => {
	const { store, actions } = useContext(Context);
	return (
		<div className="container">
			{/*Recorro cada elemento de vehiculos, planet, people */}
			{store.endpoints.map((endpoint, index) => {
				return (
					<div key={index}>
						{/*En esta parte accedo a la primera letra charAt para ponerla en mayuscula toUpperCase y luego continuo la otra parte de los caracteres con el slice*/}
						<h2 className="display-3 mt-4">{`${endpoint.charAt(0).toUpperCase()}${endpoint.slice(1)}`}</h2>
						<div className="horizontal-deck">
							{/*Si hay algo dentro accedo adentro si no no */}
							{store[endpoint].length > 0 && (
								<>
									{/*Accedo al store de ese tipo, es decir al store.vehiculos o al store.planet.. y así sucesivamente. lo recorro y los guardo cada un en item. */}
									{store[endpoint].map(item => {
										//Llamo al componente y le envio la llave con el itemId su tipo de nombre que es (vehicule, planet, people) y le envio todo el item.
										return <ItemCard key={item.globalId} nature={endpoint} item={item} />;
									})}
								</>
							)}
							{/*Si esta la palabra next en mi store de ese tipo de elemento accedo al loadMore */}
							{"next" in store[`${endpoint}Response`] &&
								//Si next es diferente a null accedo a LoadMore enviadole los datos que quiero
								store[`${endpoint}Response`].next != null && (
									//Le envio el tipo de elemento que es (vehicule, planet, people) y le

									<LoadMore endpoint={endpoint} next={store[`${endpoint}Response`].next} />
								)}
						</div>
						<hr className="my-4" />
					</div>
				);
			})}
		</div>
	);
};
