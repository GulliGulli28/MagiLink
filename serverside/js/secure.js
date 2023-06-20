function identify_by_cookie(){
    return
}

function secure(input){    
    for (let key in input)
        input[key] = sanitizeHtml(input[key]).replace(/[.*+?^${}=`()|[\]\\]/g, '\\$&');
    return input;
}