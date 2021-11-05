Please note that for every request made to the service, you must specify which database collection you are using. The collection name corresponds to your fist name (***MUST CAPITILIZE FIRST LETTER OF YOUR NAME***).

This login service uses simple email-password combinations for authentication and registration. User passwords are hashed when stored in the database for security purposes. 

All requests and responses are JSON Format.

Current URL: http://flip3.engr.oregonstate.edu:7070/


USER REGISTRATION
    Request Format:
        POST request at http://flip3.engr.oregonstate.edu:7070/register
        req = {
            collection: Josh,
            email: user@email.com,
            password: password123!
        }

    Response Format:
        if an email is not already in use and registration is successful:
            res = {
                alreadyRegistered : false,
                newlyRegistered: true
            }

        if an email is already registered:
            res = {
                alreadyRegistered : true,
                newlyRegistered: false
            }

        if an incorrect collection is specified:
            res = {
                errorMessage: 'Collection Not Found'
            }
        
        if there are server issues on the services end:
            res = {
                errorMessage: 'error'
            }

USER LOGIN
    Request Format:
        POST request at http://flip3.engr.oregonstate.edu:7070/login
        req = {
            collection: Esther,
            email: user@email.com,
            password: password123!  
        }

    Response Format:
        If email and password are correct:
            res = {
                userNotFound: false,
                successfulLogin: true
            }
        
        if password is incorrect:
            res = {
                userNotFound: false,
                successfulLogin: false
            }

        if email is not currently registered:
            res = {
                userNotFound: true,
                successfulLogin: false
            }
        
        if an incorrect collection is specified:
            res = {
                errorMessage: 'Collection Not Found'
            }
        
        if there are server issues on the services end:
            res = {
                errorMessage: 'error'
            }

RESET PASSWORD
    Request Format:
        POST request at http://flip3.engr.oregonstate.edu:7070/reset-password
        *Note* the password specified here is the new desired password for the user, not their old password.

        req = {
            collection: Patrick,
            email: user@email.com,
            password: password123!  
        }

    Response Format:
        if password change is successful:
        *Note* If email is not registered it will still give this response but the database remains unchanged.
        
            res = {
                passwordChanged : true
            }
        
        If problem with database or server connection:
            res = {
                errorMessage: 'error'
            }

        if an incorrect collection is specified:
            res = {
                errorMessage: 'Collection Not Found'
            }

DELETE USER
    Request Format:
        POST request at http://flip3.engr.oregonstate.edu:7070/delete-user
        req = {
            collection: Patrick,
            email: user@email.com,
            password: password123!  
        }
    
    Response Format:
        if email and password are correct:
            res = {
                userDeleted: true,
                incorrectPassword: false
            }
        
        if email is correct but password does not match:
            res = {
                userDeleted: false,
                incorrectPassword: true
            }

        if email is not registered:
            res = {
                userNotFound: true
            }
        
        If problem with database or server connection:
            res = {
                errorMessage: 'error'
            }
        
        if an incorrect collection is specified:
            res = {
                errorMessage: 'Collection Not Found'
            }