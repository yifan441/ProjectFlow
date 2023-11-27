export default function Task({ name, complete, id }) {
  return (
    <>
      <div className="task">
        <input type="checkbox" id={id} />
        <label htmlFor={id}>
          <span className="custom-checkbox"></span>
          {name}
        </label>
      </div>
    </>
  );
}
