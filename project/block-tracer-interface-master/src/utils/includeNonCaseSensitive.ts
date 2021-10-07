const includeNonCaseSensitive = (arr: string[], target: string) => {
    return arr.map(item => item.toLowerCase()).includes(target.toLowerCase());
}

export default includeNonCaseSensitive;