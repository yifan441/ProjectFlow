import { useMemo, useRef, useState } from 'react';

function SearchComponent() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState(''); // move this to ProjectDashboard.js
  const inputRef = useRef();

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      return item.toLowerCase().includes(query.toLowerCase());
    });
  }, [items, query]);

  function onSubmit(e) {
    e.preventDefault();

    const value = inputRef.current.value;
    if (value === '') return;
    setItems((prev) => {
      return [...prev, value];
    });

    inputRef.current.value = '';
  }

  // move all your search elements to ProjectDashboard.js --> wrap them in a div
  // add className="search-div"

  return (
    <>
      Search:
      <input value={query} onChange={(e) => setQuery(e.target.value)} type="search" />
      <br />
      <br />
      <form onSubmit={onSubmit}>
        New Item: <input ref={inputRef} type="text" />
        <button type="submit">Add</button>
      </form>
      <h3>Items:</h3>
      {filteredItems.map((item) => (
        <div>{item}</div>
      ))}
    </>
  );
}

export default SearchComponent;
