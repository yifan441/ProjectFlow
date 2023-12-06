import React, { useEffect } from 'react'

export const DisplayLoadEvent = () => {
    useEffect(() => {
      const handleLoadEvent = () => {
        const loadMessage = document.getElementById('loadingPDF');
        loadMessage.style.display = 'block';
      };

      console.log("Adding beginLoadingPDF lisener");
      document.addEventListener('beginLoadingPDF', handleLoadEvent);

      return () => {
        document.removeEventListener('beginLoadingPDF', handleLoadEvent);
      };
    }, []);

    return (
      <div id="loadingPDF" style={{ display: 'none', color: 'blue', fontSize: '10px' }}>
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
        Username or email already connected to an account.
      </div>
    );
  };

  export const DisplayInvalidLoadEvent = () => {
    useEffect(() => {
        const handleInvalidLoad = () => {
            const message = document.getElementById('errorReadingPDF');
            message.style.display = 'block';
        };

        console.log("Adding readPDFError listener");
        document.addEventListener('readPDFError', handleInvalidLoad);

        return () => {
            document.removeEventListener('readPDFError', handleInvalidLoad);
        };
    }, []);

    return (
        <div id="errorReadingPDF" style={{ display: 'none', color: 'red', fontSize: '10px' }}>
        Error reading PDF.
      </div>
    );
  };

  export const DisplayOpenAIError = () => {
    useEffect(() => {
        const handleOpenAIError = () => {
            const message = document.getElementById('invalidAI');
            message.style.display = 'block';
        };

        console.log("Adding errorAI listener");
        document.addEventListener('errorAI', handleOpenAIError);

        return () => {
            document.removeEventListener('errorAI', handleOpenAIError);
        };
    }, []);

    return (
        <div id="invalidAI" style={{ display: 'none', color: 'red', fontSize: '10px' }}>
        Error with OpenAI request.
      </div>
    );
  };
