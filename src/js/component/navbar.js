import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useRouteMatch, useHistory } from "react-router-dom";
import swIcon from "../../img/star.jpg";
import { Context } from "../store/appContext";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const [dropped, setDropped] = useState(false);
	const [search, setSearch] = useState("");
	const [options, setOptions] = useState([]);
	const history = useHistory();
	const searchRef = useRef();
	const dropRef = useRef();
	useEffect(
		() => {
			if (store.favorites.length == 0) {
				setDropped(false);
			}
		},
		[store.favorites.length]
	);
	//este useEffect es para el input para el autocomplete
	useEffect(
		() => {
			const handleClickOutside = event => {
				if (searchRef.current.contains(event.target)) {
					console.log(event.target);
					return;
				}
				setSearch("");
			};
			//lo que hago aquí es que en el momento que la logitud de la cadena sea mayor empiece a buscar y enviarle  a getSearch la busqueda que tenía en el input
			if (search.length > 2) {
				document.addEventListener("mousedown", handleClickOutside);
				actions.getSearch(search);
				//este es para si doy click fuera del input para que me borre lo que estaba buscando y se me borre lo que hay dentro del input
			} else {
				document.removeEventListener("mousedown", handleClickOutside);

				if (store.searchResults.length > 0) {
					actions.clearSearch();
				}
			}
			return () => document.removeEventListener("mousedown", handleClickOutside);
		},
		[search]
	);
	useEffect(
		() => {
			const handleDropUp = event => {
				if (dropRef.current.contains(event.target)) {
					return;
				}
				setDropped(false);
			};
			if (dropped) {
				document.addEventListener("mousedown", handleDropUp);
			} else {
				document.removeEventListener("mousedown", handleDropUp);
			}
			return () => document.removeEventListener("mousedown", handleDropUp);
		},
		[dropped]
	);
	return (
		<nav className="navbar navbar-light bg-light mb-0 mb-md-3">
			<div className="container">
				{/*Lo que hago aquí es cuando clickee en el simbolo de starwar me envie a donde to quiero */}
				<Link to="/">
					<span className="navbar-brand mb-0 h1">
						<img src={swIcon} className="nav-icon" alt="sw icon" />
					</span>
				</Link>
				<div ref={searchRef} className="col-6 mx-auto d-none d-md-flex">
					<input
						className="form-control"
						type="text"
						placeholder="search..."
						value={search}
						onChange={e => setSearch(e.target.value)}
						// onBlur={e => setSearch("")}
					/>
					{/*Si mi longitud es menor que dos no voy a entrar a esto, en el momento que sea mayor que dos entro.*/}
					{search.length > 2 && (
						<div className={"search-options"}>
							<ul>
								{/*Recorro de mi store los searcResultos y le pregunto si hay algo y si si entro dentro y si no , no muestro ningun resultado */}
								{store.searchResults.length > 0 ? (
									/*Mapeo todos mis resultados. */
									store.searchResults.map(result => {
										//devuelvo diferentes li segun los result que haya
										return (
											<li
												className="my-1"
												key={result.globalId}
												//cuando le de click borro mi busqueda y con history.push busco segun el globaId
												onClick={() => {
													setSearch("");
													history.push(`/single/${result.globalId}`);
												}}>
												{/*Muestrolos nombre buscados */}
												{result.name}
											</li>
										);
									})
								) : (
									<li>{"no results yet..."}</li>
								)}
							</ul>
						</div>
					)}
				</div>
				<div ref={dropRef} className="ml-auto ml-md-0" style={{ position: "relative" }}>
					<button
						className="btn btn-primary"
						//aqui va suceder cuando favorites la logintud sea myor que cero y ademas cambie entre true y false.
						onClick={() => store.favorites.length > 0 && setDropped(!dropped)}>
						{/*Aqui voy a mostrar favorites y ademas cuando la logintud de favoritos sea mayor que cero voy a poner cuantos favoritos hay */}
						{`favorites! `}
						{store.favorites.length > 0 && (
							<span className="badge badge-pill badge-info">{store.favorites.length}</span>
						)}
					</button>
					{/*Si es es true muestro los nombres y si es false no muetro anda */}
					<div className={dropped ? "sw-favorites" : "d-none"}>
						{/*Si tengo algo en mi store de favoritos muestro algo si no no */}
						{store.favorites.length > 0 && (
							<ul>
								{/*mapeo los favoritos que tengo para ir mostrandolos */}
								{store.favorites.map(fav => {
									return (
										<div
											key={fav.globalId}
											className="row justify-content-between align-items-center p-0 m-0">
											{/*Aquí hago una lista de todos mis favoritos  */}
											<li className="my-1">
												<Link
													className="text-decoration-none text-dark"
													to={`/single/${fav.globalId}`}
													onClick={() => setDropped(false)}>
													{fav.name}
												</Link>
											</li>
											<i
												className="fas fa-minus-circle text-danger"
												onClick={() => actions.removeFavorite(fav.globalId)}
											/>
										</div>
									);
								})}
							</ul>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};
