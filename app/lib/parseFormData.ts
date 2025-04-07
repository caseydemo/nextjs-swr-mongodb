export default function parseFormData(formData: FormData, tableKey: string) {
    if (!formData) {
        console.error("Form data is not defined");
        return null;
    }

    // exerciseGroupId is the index portion of tableKey - it is always at the end prepended with a dash
    if (!tableKey) {
        console.error("tableKey is not defined");
        return null;
    }
    // force this to be a number
    const exerciseGroupId = tableKey.split("-").pop() as string;
    if (!exerciseGroupId) {
        console.error("exerciseGroupId is not defined");
        return null;
    }

    let setsArray: any[] = [];
    let tempObj: any = {};
    formData.forEach((value, key) => {
        if (!key.includes("-")) {
            return; // skip keys that don't have a dash
        }
        const [index, fieldName] = key.split("-");
        const idx = parseInt(index, 10);
        if (!setsArray[idx]) {
            setsArray[idx] = {};
        }
        
        // add a property with key of fieldName and value of value to the object at index idx
        tempObj = {
            ...tempObj,
            [fieldName]: value,
        }
        // add the object to the array at index idx
        setsArray[idx] = {
            ...setsArray[idx],
            [fieldName]: value,
        };
                    

    });

    // combine all the parsed data into a single object
    const returnData: any = {
        setsArray,
        exerciseGroupId,
    };

    return returnData;
};