export function arraysAreEqual(arr1,arr2){
    for(let i = 0; i < arr1.length; i++){
        if(arr1[i] !== arr2[i]){
            return false;
        }
    }
    return true;
}

export function checkForArrayInArrayOfArrays(haystack, needle){
    for(let i = 0; i < haystack.length; i++){
        if(arraysAreEqual(haystack[i], needle)){
            return true;
        }
    }
    return false;
}