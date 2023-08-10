export const slugifyString = (str) => {
    if(str && str.length) {
        return str.replaceAll(' ', '-')
    }
    return str
}

export const parseSlugifiedString = (str) => {
    if(str && str.length) {
        //if there are 2 "-" next to each other, only turn the 1st into a space
        //Handicap--1.5 becomes Handicap -1.5
        //but Full-time-result becomes Full time result
        if(str.includes("--")){
            return str.replaceAll("--", " -");
        }
        else{
            return str.replaceAll("-", " ");
        }
    }
    return str
}