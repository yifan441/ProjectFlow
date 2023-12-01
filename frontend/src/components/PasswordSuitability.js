import React, { useEffect } from 'react';

//Informs registering users when they attempt to register with a password that does not meet requisites.
//Delete comments after merging.
const PasswordSuitability = () => {
    useEffect(() => {
        const handleUnsuitablePasswordEvent = () => {
            const passwordMessage = document.getElementById('passwordMessage');
            passwordMessage.style.display = 'block';
        };

        document.addEventListener('unsuitablePassword', handleUnsuitablePasswordEvent);

        return () => {
            document.removeEventListener('unsuitablePassword', handleUnsuitablePasswordEvent);
        };
    }, []);

    return (
        <div id="passwordMessage" style={{ display: 'none', color: 'red', fontSize: '10px' }}>
            Password does not meet specified requirements.
        </div>
    );
};

export default PasswordSuitability;