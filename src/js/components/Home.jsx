import React, { useState, useEffect } from "react";

const API_URL_BASE = "https://playground.4geeks.com/todo";

const Home = () => {

	const [todos, setTodos] = useState([]);
	const [inputValue, setInputValue] = useState("");

	const createUserIfNotExists = async () => {
		try {
			const response = await fetch(`${API_URL_BASE}/users/rramirez4geeks`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify([])
			});

			if (response.ok) {
				console.log("Usuario creado correctamente.");
			} else if (response.status === 400) {
				console.log("El usuario ya existe.");
			} else {
				throw new Error("Error al crear el usuario.");
			}

			const data = await response.json();
			console.log(data);

		} catch (error) {
			console.log(error);
		}
	};


	const getTodos = async () => {
		try {
			const response = await fetch(`${API_URL_BASE}/users/rramirez4geeks`, {
				method: "GET"
			});

			if (!response.ok) {
				throw new Error("Sucedio un error al consultar el endpoint.");
			}

			const data = await response.json();
			console.log(data);

			// Podemos hacer con la respuesta lo que necesitamos
			setTodos(data.todos)
		} catch (error) {
			console.log(error)
		}

	};

	const createTodo = async () => {
		try {
			if (inputValue.trim() === "") return;

			let task = {
				"label": inputValue,
				"is_done": false
			};

			const response = await fetch(API_URL_BASE + '/todos/rramirez4geeks', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(task)
			});

			if (!response.ok) {
				throw new Error("Ocurrio un error al crear la tarea.");
			}

			await response.json();
			getTodos();
			setInputValue("");

			// const data =  await response.json();
			// getTodos();


		} catch (error) {
			console.log(error);
		}
	};

	const deleteTodo = async (todoId) => {
		try {
			const response = await fetch(`${API_URL_BASE}/todos/${todoId}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				throw new Error("Ocurrio un Error al eliminar la tarea.");
			}

			getTodos();

		} catch (error) {
			console.log(error);
		}
	};

	const completedTodo = async (todoId) => {
		try {
			const todoToUpdate = todos.find(todo => todo.id === todoId);
			if (!todoToUpdate) return;

			// Invierte el estado de is_done (lo marca como completado o pendiente)
			const updatedTodo = { ...todoToUpdate, is_done: !todoToUpdate.is_done };
			// console.log(updatedTodo)

			// Envia actualización al backend
			const response = await fetch(`${API_URL_BASE}/todos/${todoId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(updatedTodo)
			});

			if (!response.ok) {
				throw new Error("Error al actualizar la tarea.");
			}

			getTodos(); 
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		createUserIfNotExists().then(() => {
			getTodos();
		});
	}, []);


	useEffect(() => {
		getTodos();
	}, []);

	return (
		<div className="container">
			<div className="row">
				<div className="col-6 mx-auto mt-4 text-center">
					<h2>Lista de Tareas</h2>
					<div className="input-group mb-3">
						<input
							type="text"
							className="form-control rounded"
							placeholder="Escribe tu tarea... "
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									createTodo();
								}
							}}
						/>
					</div>
				</div>
			</div>

			<div className="row">
				<div className="col-6 mx-auto mt-3">
					<ul className="list-group shadow">
						{todos.map((todo) => {
							return (
								<div>
									<div className='hover-div'>
										<i className="trash fas fa-trash-alt" onClick={() => deleteTodo(todo.id)}></i>
										<div key={todo.id} className={todo.is_done ? "tareas completadas" : "tareas"} >
											<li
												onClick={() => deleteTodo(todo.id)}>
												{todo.label}
											</li>
											<div>
												<input
													className="form-check-input"
													type="checkbox"
													value=""
													checked={todo.is_done}
													onClick={() => completedTodo(todo.id)}
													onChange={() => completedTodo(todo.id)}
												/>
											</div>
										</div>
									</div>
								</div>

							)
						})}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Home;