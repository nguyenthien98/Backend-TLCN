function getDistanceFromLatLongInKm(lat1, long1, lat2, long2) {
    var R = 6371 // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1)  // deg2rad below
    var dLong = deg2rad(long2 - long1)
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2)
        
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    var d = R * c // Distance in km
    return d
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function distanceListPlace(listProject, radius, lat, long) {
    var result = []
    listProject.forEach(project => {
        const temp = getDistanceFromLatLongInKm(lat, long, project.lat, project.long)
        // console.log(temp)
        if (radius > temp) {
            result.push(project)
        }
    })
    return result
}

function findProjectByOwner(listProject, id) {
    var result = []
    listProject.forEach(project => {
        console.log(project.ownerid + ' ' + id)
        if (project.ownerid == id) {
            result.push(project)
        }
    })
    return result
}

function convertData(inStr) {
    var result = {
        start: 0,
        end: 9999999999,
    }
    if (inStr == 0) {
        return result
    }
    var temp = inStr.split('-')
    result.start = parseInt(temp[0])
    result.end = parseInt(temp[1])
    return result
}

function hashString(str) {
    var hash = 0, i, chr
    if (str.length === 0) return hash
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + chr
        hash |= 0 // Convert to 32bit integer
    }
    return hash
}

function randomPassword(length) {
    var result           = ''
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

function createCodeList(a) {
    var temp = a.map(element => {
        return {
            code: element,
            sold: false,
        }
    })
    return temp
}

function preProcessingString(str) {
    var str = str.toLowerCase().trim()
    str = str.replace(new RegExp("[àáạảãâầấậẩẫăằắặẳẵ]", "gm"), "a")
    str = str.replace(new RegExp("[èéẹẻẽêềếệểễ]", "gm"), "e")
    str = str.replace(new RegExp("[ìíịỉĩ]", "gm"), "i")
    str = str.replace(new RegExp("[òóọỏõôồốộổỗơờớợởỡ]", "gm"), "o")
    str = str.replace(new RegExp("[ùúụủũưừứựửữ]", "gm"), "u")
    str = str.replace(new RegExp("[ỳýỵỷỹ]", "gm"), "y")
    str = str.replace(new RegExp("[đ]", "gm"), "d")
    return str
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = i; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

function compareString(str, text) {
    str = preProcessingString(str)
    text = preProcessingString(text)
    const wordsMatch = str.length - editDistance(text, str);
    const percent = wordsMatch / text.length;
    if (percent >= 0.95) {
        console.log(str)
        return true
    } else {
        return false
    }
}

function searchLevenshtein(temp, address) {
    const result = temp.filter(each => {
        return compareString(each.address, address)
    })
    return result
}
function convertArrayToString(filters) {
    let string = "";
    filters.map(element => {
        string += element + ' ';
    });
    return string;
};

module.exports.getDistanceFromLatLongInKm = getDistanceFromLatLongInKm
module.exports.distanceListPlace = distanceListPlace
module.exports.findProjectByOwner = findProjectByOwner
module.exports.convertData = convertData
module.exports.hashString = hashString
module.exports.randomPassword = randomPassword
module.exports.createCodeList = createCodeList
module.exports.searchLevenshtein = searchLevenshtein
module.exports.convertArrayToString = convertArrayToString
