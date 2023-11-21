import React, { useState } from 'react';

const Navbar = ({ fetchData }) => {
  const [filters, setFilters] = useState({}); // State to hold filters

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleApplyFilters = () => {
    fetchData(filters); // Trigger API call with selected filters
  };

  return (
    <nav className="bg-gray-200 p-4">
      <h1 className="font-bold">Filter Section</h1>
      <div className="flex space-x-4 mt-4">
        {/* Add your filter inputs */}
        <input
          type="text"
          name="end_year"
          placeholder='end_year'
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="topic"
          placeholder='topic'
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="sector"
          placeholder='sector'
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="region"
          placeholder='region'
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="pestle"
          placeholder='pestle'
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="source"
          placeholder='source'
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="country"
          placeholder='country'
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
        <button
          onClick={handleApplyFilters}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Apply Filters
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
