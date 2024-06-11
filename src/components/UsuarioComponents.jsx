import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';

export const UsuarioComponents = () => {
  const { data, isLoading, errors } = useFetch('https://api.fake-rest.refine.dev/users');
  const [users, setUsers] = useState([]);

  React.useEffect(() => {
    if (data) {
      const activeUsers = data.filter(user => user.status).sort((a, b) => a.id - b.id);
      setUsers(activeUsers);
    }
  }, [data]);

  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const handleChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const newId = users.length ? Math.max(...users.map(user => user.id)) + 1 : 1;
    const userToAdd = {
      id: newId,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      status: true,
    };
    setUsers([...users, userToAdd]);
    setNewUser({ firstName: '', lastName: '', email: '' });
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  return (
    <>
      <h1>Listado de Usuarios</h1>
      {
        isLoading 
        ? <h4>Cargando...</h4>
        : errors
        ? <p>Ha ocurrido un error: {errors}</p>
        : <>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">First Name</th>
                  <th scope="col">Last Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Accion</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <th scope="row">{user.id}</th>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>
                      <button onClick={() => handleDeleteUser(user.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h2>Add New User</h2>
            <form onSubmit={handleAddUser}>
              <input 
                type="text" 
                name="firstName"
                placeholder="First Name" 
                value={newUser.firstName} 
                onChange={handleChange} 
                required 
              />
              <input 
                type="text" 
                name="lastName"
                placeholder="Last Name" 
                value={newUser.lastName} 
                onChange={handleChange} 
                required 
              />
              <input 
                type="email" 
                name="email"
                placeholder="Email" 
                value={newUser.email} 
                onChange={handleChange} 
                required 
              />
              <button type="submit">Añadir usuario</button>
            </form>
          </>
      }
    </>
  );
};
