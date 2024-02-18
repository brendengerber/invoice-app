//Adds property to database objects sent via form submits
//Recursive function will add the property to nested objects from associations as well
//Object is the object to update, newKey is a string for the key to be added, and newValue is the newKey's corresponding value
//Useful for adding ids, userIds, invoiceIds, etc to objects with associations
function addPropertyToObjectRecursively(object, newKey, newValue){
    //If the object is an object and not an array, adds the new key/value pair
    //Important in case a property with type of string, number, float, etc is passed in
    if(object && typeof object === 'object' && !Array.isArray(object)){
        object[newKey] = newValue;
    }
    
    //Loops over all the keys in the object calling the function on them if they are of type object
    //In case the object is an array, this will also loop through the array and call the function on each index
    for(let key in object){
        //In case the object is not an array, calls the function on it
        if(object[key] && typeof object[key] === 'object' && !Array.isArray(object[key])){
            addPropertyToObjectRecursively(object[key], newKey, newValue); 
        //In case the object is an array, loops over the array, and calls the function on each index
        }else if(object[key] && Array.isArray(object[key])){
            for(let index of object[key]){
                addPropertyToObjectRecursively(index, newKey, newValue);
            }
        }
    }
    return object
};

module.exports = {
    addPropertyToObjectRecursively
};