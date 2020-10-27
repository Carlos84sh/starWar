const api = "https://swapi.dev/api/";
const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			endpoints: ["people", "vehicles", "planets"],
			peopleResponse: {},
			people: [],
			planetsResponse: {},
			planets: [],
			vehiclesResponse: {},
			vehicles: [],
			favorites: JSON.parse(localStorage.getItem("favorites")) || [],
			single: {},
			searchResults: []
		},
		actions: {
			//esta acción corresponde a acceder a cada elemento por individual para traerme la información que necesito. Por lo que recibo de que tipo es y su id.
			fetchItem: async (endpoint, id) => {
				//Me traigo el store.
				const store = getStore();
				//aqui accedo al elemento y al id en específico.
				let url = `${api}${endpoint}/${id}/`;
				try {
					//espero la respuesta
					let response = await fetch(url);
					console.log(response);
					//si mi respuesta es true accedo.

					if (response.ok) {
						//transformo mi respuesta en json.
						let single = await response.json();
						//escojo mi numero, es decir que pagina es.
						let singleId = single.url.match(/[/][0-9]+[/]/)[0].replace(/[/]/g, "");
						//luego lo guardo tipo vehiculo-4, es un ejemplo.
						let singleGlobalId = `${endpoint}-${singleId}`;
						//almaceno en mi store, el id, y el globalId
						setStore({
							...store,
							single: {
								...single,
								id: singleId,
								globalId: singleGlobalId
							}
						});
						//en caso de no obtener la respuesta guardo simplemente el status.
					} else {
						setStore({
							...store,
							single: { status: response.status }
						});
					}
					//si hay algun tipo de error, guardo el error.
				} catch (error) {
					setStore({
						...store,
						single: { status: error }
					});
				}
			},
			//recibo el tipo que es y el numero de pagina que es.
			fetchItems: async (endpoint, page = 1) => {
				//me traigo el store.
				const store = getStore();
				//accedo a esa url con esas caracteristicas.
				let url = `${api}${endpoint}/?page=${page}`;
				try {
					//espero la respuesta
					let response = await fetch(url);
					//accedo al tipo de store, vehiculos, people,planets y lo guardo en itemList
					let itemList = store[endpoint];
					//si mi respuesta ok es true accedo.
					if (response.ok) {
						//transformo mi respuesta en json
						let responseObject = await response.json();
						//recorro cada resultado.

						//recorro cada resultado por individual
						for (let item of responseObject.results) {
							//guardo su id

							item.id = item.url.match(/[/][0-9]+[/]/)[0].replace(/[/]/g, "");
							//y guardo su globalId segun el tipo que sea y segun que id tiene
							item.globalId = `${endpoint}-${item.id}`;

							//guardo en mi "store" en la lista que me traje del store de ese tipo
							itemList.push(item);
						}
						//guardo en mi localStorgae mi nueva lista.
						localStorage.setItem(endpoint, JSON.stringify(itemList));
						//guardo en mi localStore la resppuesta de ese tipo de elemento
						localStorage.setItem(
							`${endpoint}Response`,
							JSON.stringify({
								//guardo mi count
								count: responseObject.count,
								//guardo si hay algo previo
								previous: responseObject.previous,
								//guardo si hay algo despues, con el split como se que la url es ....=("al numero") accedo con el split a esa posición
								next: responseObject.next == null ? null : responseObject.next.split("=")[1]
							})
						);
						//Devuelve el número de milisegundos desde el 01/01/1970:
						localStorage.setItem(`${endpoint}Timestamp`, JSON.stringify(new Date().getTime()));
						//guardo en mi store
						setStore({
							//dejo mi store como estaba
							...store,
							//guardo en mi tipo de elemento la nueva lista con sus nuevos elementos.
							[endpoint]: itemList,
							//guardo en mi tipo de elemento con su respectiva respuesta los datos siguientes.
							[`${endpoint}Response`]: {
								//el contador
								count: responseObject.count,
								//si hay algo antes.
								previous: responseObject.previous,
								//si hay algo despues.
								next: responseObject.next == null ? null : responseObject.next.split("=")[1]
							}
						});
						//si mi respuesta no ha sido correcta accedo a este else.
					} else {
						setStore({
							...store,
							[endpoint]: [],
							[`${endpoint}Response`]: { status: response.status }
						});
					}
				} catch (error) {
					setStore({
						...store,
						[endpoint]: [],
						[`${endpoint}Response`]: { status: error }
					});
				}
			},
			//recibo el elemtno que quiero añadir en favorito.
			addFavorite: item => {
				//accedo a mi store
				const store = getStore();
				//guardo en localstore en un apartado llamado favoritos lo que tengo en el store.favoritos y mi nuevo item.
				localStorage.setItem("favorites", JSON.stringify([...store.favorites, item]));
				//guardo en store ese item favorito.
				setStore({
					...store,
					favorites: [...store.favorites, item]
				});
			},
			//recibo el globalId
			removeFavorite: globalId => {
				//accedo al store
				const store = getStore();
				//mediante la funcion filter selecciono todo auqello que sea diferente a eese globalId
				let newFavs = store.favorites.filter(item => {
					return item.globalId != globalId;
				});
				//guardo en mi localStorage mis nuevos favoritos.
				localStorage.setItem("favorites", JSON.stringify([...store.favorites, newFavs]));
				//guardo en mi store favoritos los nuevos favoritos que tengo.
				setStore({
					...store,
					favorites: newFavs
				});
			},
			getSearch: async search => {
				//recibo las iniciales del nombre buscado y accedo al store
				const store = getStore();
				//creo un array vacio
				let searchResults = [];
				//recorro todos mi endpoints (vehiculos, planets, people)
				for (let endpoint of store.endpoints) {
					//accedo a mis elementos y ademas al que me traigo de fuera para poder acceder a su información
					let url = `${api}${endpoint}/?search=${search}`;
					//espero la respuesta
					let response = await fetch(url);
					//si la respuesta es true accedo.
					if (response.ok) {
						//transformo mi respuesta a json
						let responseObject = await response.json();
						console.log("estoy aquí", responseObject);
						//aqui le comento si mi count es mayot que cero hazme este if
						if (responseObject.count > 0) {
							//recorro mi array  uno por uno y lo guardo en item
							for (let item of responseObject.results) {
								//aqui accedo a mi url para guardar el numero
								let id = item.url.match(/[/][0-9]+[/]/)[0].replace(/[/]/g, "");
								//guardo mi clobal id
								let globalId = `${endpoint}-${id}`;
								//y en array guardo la infromacion que deseo.
								searchResults.push({
									...item,
									id: id,
									globalId: globalId
								});
							}
						}
					}
				}
				//aqui en el store guardo la lista que tendré para luego mostrarla
				setStore({
					...store,
					searchResults: searchResults
				});
			},
			//esta funcion es para limpiar nuestro campo de searchresult.
			clearSearch: () => {
				const store = getStore();
				setStore({
					...store,
					searchResults: []
				});
			},

			localItems: endpoint => {
				const store = getStore();
				setStore({
					...store,
					[endpoint]: JSON.parse(localStorage.getItem(endpoint)),
					[`${endpoint}Response`]: JSON.parse(localStorage.getItem(`${endpoint}Response`))
				});
			}
		}
	};
};

export default getState;
