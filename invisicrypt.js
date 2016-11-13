function embedString() {
    var decoyStr = document.getElementById('decoy-text').value,
        messageStr = document.getElementById('message-text').value;
    var insertPosition = Math.floor(Math.random() * (decoyStr.length - 1) + 1);
    document.getElementById('combined-text').value = decoyStr.slice(0, insertPosition) + encodeString('STR\0' + messageStr) + decoyStr.slice(insertPosition);
}

function encodeString(str) {
    var strBytes = stringToBytes(str),
        outputStr = '',
        encodingChars = [
            '\u200B', // zero width space
            '\u200C', // zero width non-joiner
            '\u200D', // zero width joiner
            '\uFEFF'  // zero width non-breaking space
        ];
    for (var i = 0, sLen = str.length; i < sLen; i++)
        for (var j = 6; j >= 0; j -= 2)
            outputStr += encodingChars[(strBytes[i] >> j) & 0x3];
    return outputStr;
}

function decodeString() {
    var extractedStr = extractString(document.getElementById('combined-text').value),
        outputStr = '',
        encodingVals = {
            '\u200B':0,
            '\u200C':1,
            '\u200D':2,
            '\uFEFF':3
        };
    for (var i = 0, sLen = extractedStr.length; i < sLen; i += 4) {
        var charCode = 0;
        for (var j = 0; j < 4; j++) {
            charCode += encodingVals[extractedStr[i + j]] << (6 - j * 2);
        }
        outputStr += String.fromCharCode(charCode);
    }
    if (outputStr.slice(0, 4) == 'STR\0')
        document.getElementById('message-text').value = outputStr.slice(4);
    else
        console.log('Please run the Python version to extract files.')
}

function extractString(str) {
    return str.match(/[\u200B\u200C\u200D\uFEFF]/g);
}

// Credit: http://stackoverflow.com/questions/1240408/reading-bytes-from-a-javascript-string
function stringToBytes(str) {
    var byteArray = [];
    for (var i = 0; i < str.length; i++)
        if (str.charCodeAt(i) <= 0x7F)
            byteArray.push(str.charCodeAt(i));
        else {
            var h = encodeURIComponent(str.charAt(i)).substr(1).split('%');
            for (var j = 0; j < h.length; j++)
                byteArray.push(parseInt(h[j], 16));
        }
    return byteArray;
};

function scale() {
    document.body.style.fontSize = window.innerWidth * 0.02 + 'px';
}

window.onreadystatechange = scale();
