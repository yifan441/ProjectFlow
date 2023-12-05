import React, { useEffect } from 'react'

export const DisplayLoadEvent = () => {
    useEffect(() => {
      const handleLoadEvent = () => {
        const loadMessage = document.getElementById('loadingPDF');
        loadMessage.style.diplay = 'block';
      };

      console.log("Adding beginLoadingPDF lisener");
      document.addEventListener('beginLoadingPDF', handleLoadEvent);

      return () => {
        document.removeEventListener('beginLoadingPDF', handleLoadEvent);
      };
    }, []);

    return (
      <div id="loadingPDF" style={{ display: 'none', color: 'red', fontSize: '10px' }}>
        Loading auto-generated project from PDF
      </div>
    );
  };

  export const InvalidLogin = () => {
    useEffect(() => {
        const handleInvalidLogin = () => {
            const message = document.getElementById('loginError');
            message.style.display = 'block';
        };

        console.log("Adding invalidLogin listener");
        document.addEventListener('invalidLogin', handleInvalidLogin);

        return () => {
            document.removeEventListener('invalidLogin', handleInvalidLogin);
        };
    }, []);

    return (
        <div id="loginError" style={{ display: 'none', color: 'red', fontSize: '10px' }}>
        Invalid Email or Password.
      </div>
    );
  };

  export const UserAlreadyExists = () => {
    useEffect(() => {
        const handleExistingUser = () => {
            const message = document.getElementById('userExists');
            message.style.display = 'block';
        };

        console.log("Adding existingUser listener");
        document.addEventListener('existingUser', handleExistingUser);

        return () => {
            document.removeEventListener('existingUser', handleExistingUser);
        };
    }, []);

    return (
        <div id="userExists" style={{ display: 'none', color: 'red', fontSize: '10px' }}>
        Account registered to this email already exists.
      </div>
    );
  };

