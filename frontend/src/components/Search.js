import React, { useState } from 'react';

export default function Search() {
  const [searchValue, setSearchValue] = useState('');

  const handleChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform your search logic here based on `searchValue`
    console.log('Searching for:', searchValue);
  };

  return (
    <form onSubmit={handleSubmit}>
      Search:
      <input
        type="text"
        value={searchValue}
        onChange={handleChange}
        placeholder="Search..."
      />
      <button type="submit">Search</button>
    </form>
  );
}