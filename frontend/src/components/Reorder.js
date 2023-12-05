import React from 'react';

export function ReorderProject({
    selectedProjectId,
    handleMoveProject,
}) {

    const thisId = selectedProjectId;

    return (
        <div>
            <button style={{fontSize: '8px'}}  onClick={() => handleMoveProject(thisId, 1)}>
                &#9650; {/*Unicode for up arrow*/}
            </button>
            <button style={{fontSize: '8px'}} onClick={() => handleMoveProject(thisId, 0)}>
                &#9660; {/*Unicode for down arrow*/}
            </button>
        </div>
    )
}

export function deepCopyArray(arr) {
    return arr.map(item => {
      if (Array.isArray(item)) {
        // If the item is an array, recursively deep copy it
        return deepCopyArray(item);
      } else if (typeof item === 'object' && item !== null) {
        // If the item is an object, recursively deep copy it
        return deepCopyObject(item);
      } else {
        // If the item is neither an array nor an object, simply copy it
        return item;
      }
    });
  }
  
 export function deepCopyObject(obj) {
    const copiedObject = {};
    for (let key in obj) {
      if (Array.isArray(obj[key])) {
        // If the property is an array, recursively deep copy it
        copiedObject[key] = deepCopyArray(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        // If the property is an object, recursively deep copy it
        copiedObject[key] = deepCopyObject(obj[key]);
      } else {
        // If the property is neither an array nor an object, simply copy it
        copiedObject[key] = obj[key];
      }
    }
    return copiedObject;
  }

 export const deepCopyProject = (inputObject) => {
    if (typeof inputObject !== 'object' || inputObject === null) {
      // Base case: return primitive values directly
      return inputObject;
    }

    if (Array.isArray(inputObject)) {
      // If it's an array, recursively copy each element
      return inputObject.map((item) => deepCopyProject(item));
    }

    // If it's an object, recursively copy each property
    const copiedObject = {};
    for (const key in inputObject) {
      if (Object.prototype.hasOwnProperty.call(inputObject, key)) {
        copiedObject[key] = deepCopyProject(inputObject[key]);
      }
    }
    return copiedObject;
  };