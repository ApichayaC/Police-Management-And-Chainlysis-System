const loadData = (key: string) => {
    try {
        const dataStr = localStorage.getItem(key);
        return dataStr ? JSON.parse(dataStr) : null;
    } catch (e) {
        return null;
    }
}

const saveData = (key: string, value: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { }
}

const removeData = (key: string) => {
    try {
        localStorage.removeItem(key);
    } catch (e) { }
}

export default {
    loadData,
    saveData,
    removeData
}