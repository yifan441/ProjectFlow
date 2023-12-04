let timestampCounter = Date.now();

function addIdAndAttributes(obj) {
  obj.id = timestampCounter.toString();
    if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const elementTimestamp = timestampCounter++;
      obj[i].id = elementTimestamp.toString();

      if (obj[i].tasks && Array.isArray(obj[i].tasks)) {
        for (let j = 0; j < obj[i].tasks.length; j++) {
          const taskTimestamp = timestampCounter++;
          obj[i].tasks[j].id = taskTimestamp.toString();
          obj[i].tasks[j].complete = false;
          obj[i].tasks[j].attributes = { priority: 'none', dueDate: null };
        }
      }
      if (obj[i] && typeof obj[i] === 'object') {
        addIdAndAttributes(obj[i]);
      }
    }
  } else if (typeof obj === 'object') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] && typeof obj[key] === 'object') {
          addIdAndAttributes(obj[key]);
        }
      }
    }
  }
}


function addIdToJsonString(jsonString) {
  const jsonObject = JSON.parse(jsonString);
  addIdAndAttributes(jsonObject);
  return jsonObject;
}

module.exports = { addIdToJsonString };





  