import React from 'react';
import Table from './components/Table';
import './App.css';

function App() {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'department', label: 'Department' },
    { key: 'status', label: 'Status' },
  ];

  const data = [
    { id: 1, name: 'Alice Johnson', role: 'Admin', department: 'IT', status: 'Active' },
    { id: 2, name: 'Bob Smith', role: 'User', department: 'Sales', status: 'Active' },
    { id: 3, name: 'Charlie Brown', role: 'User', department: 'Marketing', status: 'Away' },
    { id: 4, name: 'Diana Ross', role: 'Manager', department: 'Sales', status: 'Active' },
    { id: 5, name: 'Edward Norton', role: 'User', department: 'IT', status: 'Offline' },
    { id: 6, name: 'Frank Wright', role: 'User', department: 'Marketing', status: 'Active' },
    { id: 7, name: 'Grace Hopper', role: 'Admin', department: 'IT', status: 'Active' },
    { id: 8, name: 'Hank Green', role: 'User', department: 'Sales', status: 'Offline' },
    { id: 9, name: 'Ivy Blue', role: 'Manager', department: 'Marketing', status: 'Away' },
    { id: 10, name: 'Jack Black', role: 'User', department: 'IT', status: 'Active' },
    { id: 11, name: 'Kelly Clarkson', role: 'User', department: 'Sales', status: 'Active' },
    { id: 12, name: 'Larry Page', role: 'Admin', department: 'IT', status: 'Active' },
    { id: 13, name: 'Mary Jane', role: 'User', department: 'Marketing', status: 'Offline' },
    { id: 14, name: 'Nancy Drew', role: 'User', department: 'Sales', status: 'Active' },
    { id: 15, name: 'Oscar Wilde', role: 'Manager', department: 'Marketing', status: 'Away' },
    { id: 16, name: 'Peter Parker', role: 'User', department: 'IT', status: 'Active' },
    { id: 17, name: 'Quincy Jones', role: 'User', department: 'Sales', status: 'Offline' },
    { id: 18, name: 'Rachel Green', role: 'User', department: 'Marketing', status: 'Active' },
  ];

  return (
    <div className="app">
      <h1>Employee Directory</h1>
      <p>Demonstration of Sorting, Filtering, and Pagination</p>
      <Table data={data} columns={columns} rowsPerPage={5} />
    </div>
  );
}

export default App;
