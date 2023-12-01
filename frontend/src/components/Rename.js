import React, { useState } from 'react';

//Incorporates a functionality suite that allows users to edit the names of Projects, List entries, and tasks

export default function RenameProject({
    handleRenameProject,
    selectedProjectId,
}) {
    const [inputValue, setInputValue] = useState('');

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    // Updates name of selected project
    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue === '') return;
        let newName = inputValue;
        let projectId = selectedProjectId;
        handleRenameProject(newName, projectId);
        document.removeEventListener('renameFlag', handleRenameEvent)
        const renameBox = document.getElementById('renameBox');
        renameBox.style.display = 'none';
        setInputValue('');
    };

    //Displays renaming feature
    const handleRenameEvent = () => {
        const renameBox = document.getElementById('renameBox');
        renameBox.style.display = 'block';
    };

    document.addEventListener('renameFlag', handleRenameEvent);

    return (
        <div id="renameBox" style={{ display: 'none' }}>
            <form action="" className="new-list-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    placeholder="Rename selected"
                    aria-label="Rename selected"
                />
                <button type="submit" className="btn-create" aria-label="Rename selected">
                    Confirm
                </button>
            </form>
        </div>
    );
}