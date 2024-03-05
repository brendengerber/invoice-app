//Route functionality is kept here in seperate middleware functions to maintain separation of concerns and allow for re-use in multiple routes
//Middleware functions are in charge of calling the correct services with the correct arguments, attatching results to the req object, and handling any errors before passing them up to the error handling middleware with next(err)

//This function can be used to assign the roles that are allowed to access a route, and check if req.user has any of those roles
//Roles is an array of roles allowed to access the resource on a specific route (admin, group memeber, owner)
//Resource is a string for the req property for the resources that will be checked

//New roles can be added by adding additional if statements and their associated checking logic 
//New roles should return next() if the user is found to be authorized and do nothing if they are found unauthorized (as the function throws an unauthorized error by default)
//This prevents other checks from being run once at least one valid authorized role is found
function verifyUserAuthorization(roles, resource){
    return (req, res, next) => {
        try{
            //Checks if the logged in user has the admin role
            if(roles.includes('admin')){
                if(req.user.roles.includes('admin')){
                    return next();
                }
            }

            //Checks if the logged in user is the owner of the resource by comparing req.user.id to resource.userId
            if(roles.includes('owner')){
                //Handles cases where the resource is an array and checks ownership of all resources in the array
                //If ownership is found false on any resource, the check fails, and authorized is left as false
                if(Array.isArray(req[resource])){
                    let allAuthorized;
                    for(let item of req[resource]){
                        if(req.user.id !== item.userId){
                            allAuthorized = false;
                            break;
                        } 
                    }
                    if(allAuthorized !== false){
                        return next();
                    }
                //Handles cases of a single resource
                }else if(req.user.id === req[resource].userId){
                    return next();
                }
            }

            //A 401 error is thrown by default unless a valid authorized role is found
            let error = new Error("Access denied");
            error.status = 401;
            throw error
            
        }catch(err){
            next(err);
        }
    }
};

module.exports = {
    verifyUserAuthorization
};