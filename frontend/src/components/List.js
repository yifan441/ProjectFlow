export default function List({ listObj }) {
  function getTaskCompletion(list) {
    const completeTaskCount = list.tasks.filter((task) => task.complete).length;
    const totalTaskCount = list.tasks.length;
    const percentageComplete = (completeTaskCount / totalTaskCount) * 100;
    return `${percentageComplete}% Complete`;
  }

  return (
    <>
      <div className="list-div">
        <div className="list-header">
          <h3 className="list-title">{listObj.name}</h3>
          <span className="task-count">5% Complete</span>
        </div>
        <div className="list-body">
          <div className="tasks-div">
            <div className="task">
              <input type="checkbox" id="task-1" />
              <label htmlFor="task-1">
                <span className="custom-checkbox"></span>
                task 1
              </label>
            </div>
            <div className="task">
              <input type="checkbox" id="task-2" />
              <label htmlFor="task-2">
                <span className="custom-checkbox"></span>
                task 2
              </label>
            </div>
            <div className="task">
              <input type="checkbox" id="task-3" />
              <label htmlFor="task-3">
                <span className="custom-checkbox"></span>
                task 3
              </label>
            </div>
          </div>
        </div>
        <div className="new-task-creator">
          <form action="">
            <input type="text" placeholder="new task name" aria-label="new task name" />
            <button aria-label="create new task">+</button>
          </form>
        </div>
      </div>
    </>
  );
}
