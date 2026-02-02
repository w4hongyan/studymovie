import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Table from './Table';

describe('Table Component', () => {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
  ];

  const data = [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
    { name: 'Charlie', age: 35 },
    { name: 'David', age: 28 },
    { name: 'Eve', age: 22 },
    { name: 'Frank', age: 40 },
  ];

  it('renders table with data', () => {
    render(<Table data={data} columns={columns} rowsPerPage={5} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    // Default page size is 5, so Frank shouldn't be visible yet
    expect(screen.queryByText('Frank')).not.toBeInTheDocument();
  });

  it('sorts data when header is clicked', () => {
    render(<Table data={data} columns={columns} rowsPerPage={10} />);
    
    // Initial order (by index/default): Alice, Bob, Charlie...
    const rows = screen.getAllByRole('row');
    // row[0] is header, row[1] is first data row
    expect(rows[1]).toHaveTextContent('Alice');

    // Sort by Age (ascending)
    fireEvent.click(screen.getByText('Age'));
    const sortedRowsAsc = screen.getAllByRole('row');
    expect(sortedRowsAsc[1]).toHaveTextContent('Eve'); // 22
    expect(sortedRowsAsc[2]).toHaveTextContent('Bob'); // 25

    // Sort by Age (descending)
    fireEvent.click(screen.getByText('Age'));
    const sortedRowsDesc = screen.getAllByRole('row');
    expect(sortedRowsDesc[1]).toHaveTextContent('Frank'); // 40
  });

  it('filters data based on search input', () => {
    render(<Table data={data} columns={columns} rowsPerPage={10} />);
    
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'ali' } });

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
  });

  it('paginates data', () => {
    render(<Table data={data} columns={columns} rowsPerPage={2} />);
    
    // Page 1
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.queryByText('Charlie')).not.toBeInTheDocument();

    // Go to Page 2
    fireEvent.click(screen.getByText('Next'));
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.getByText('David')).toBeInTheDocument();
  });

  it('resets to page 1 when filtering', () => {
    render(<Table data={data} columns={columns} rowsPerPage={2} />);
    
    // Go to Page 2
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();

    // Filter
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'a' } }); // Matches Alice, Charlie, David, Frank...

    // Should reset to Page 1
    expect(screen.getByText('Page 1 of', { exact: false })).toBeInTheDocument();
  });
});
