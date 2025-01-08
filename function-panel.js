function getBetween(string, start, end) {
    const startIndex = string.indexOf(start);
    if (startIndex === -1) return '';
    const endIndex = string.indexOf(end, startIndex + start.length);
    if (endIndex === -1) return '';
    return string.substring(startIndex + start.length, endIndex);
}

function removeFromString(string, pattern) {
    return string.replace(new RegExp(pattern, 'g'), '');
}

function randomString(length) {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
}

function encrypt(code) {
    const salt = randomString(128);
    const password = randomString(16);

    const keyIv = CryptoJS.PBKDF2(password, CryptoJS.enc.Utf8.parse(salt), {
        hasher: CryptoJS.algo.SHA512,
        keySize: (32 + 16) / 4,
        iterations: 999
    });

    const key = CryptoJS.lib.WordArray.create(keyIv.words.slice(0, 8));
    const iv = CryptoJS.lib.WordArray.create(keyIv.words.slice(8, 12));

    const encrypted = CryptoJS.AES.encrypt(code, key, {
        iv: iv
    }).toString();

    return {
        a: encrypted,
        b: salt,
        c: CryptoJS.enc.Hex.stringify(iv),
        d: password
    };
}

function copyCookie(id, cookie, domain) {
    const button = document.getElementById(`button-${id}`);
    const spinner = document.getElementById(`spinner-${id}`);
    const loading = document.getElementById(`loading-${id}`);
    const login = document.getElementById(`login-${id}`);
    button.disabled = true;
    spinner.classList.remove('d-none');
    login.classList.add('d-none');
    loading.classList.remove('d-none');
    fetch('?apiweb&cookie=' + cookie)
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                navigator.clipboard.writeText(data.data);
                alert('Cookie copied');
            } else {
                alert('Cookie not found');
            }
            button.disabled = false;
            spinner.classList.add('d-none');
            login.classList.remove('d-none');
            loading.classList.add('d-none');
        });
}

function hidePageUrl(text) {
    const toBinaryPattern = (char) => {
        const binary = char.charCodeAt(0).toString(2).padStart(8, '0');
        return binary.split('0').join('p').split('1').join('%');
    };
    let pos = 0;
    let result = [];
    let currentLine = '';

    while (pos < text.length) {
        currentLine += toBinaryPattern(text[pos]);

        if (pos < text.length - 1) {
            currentLine += ' '.repeat(6);
        }
        if (currentLine.length >= 40 || pos === text.length - 1) {
            result.push(currentLine);
            currentLine = '';
        }

        pos++;
    }
    return result;
}

async function getWord() {
    const response = await axios.get('https://random-word.ryanrk.com/api/en/word/random/');
    return response.data[0].replace(/[^\p{L}\p{N}\s]/gu, '').toLowerCase();
};

async function getSentence() {
    const response = await axios.get('https://baconipsum.com/api/?type=meat-and-filler&sentences=1');
    return response.data[0];
};

function decodeAndReplaceAll(encodedString, variables) {
    const decoded = atob(encodedString);
    const regex = /\${([^}]+)}/g;
    return decoded.replace(regex, (match, variable) => {
        return variables[variable] ?? match;
    });
}

function randomSplit(input, numSplits) {
    let result = [];
    let strLength = input.length;
    let splitPoints = new Set();
    while (splitPoints.size < numSplits - 1) {
        splitPoints.add(Math.floor(Math.random() * strLength));
    }
    splitPoints = Array.from(splitPoints).sort((a, b) => a - b);
    let start = 0;
    for (let point of splitPoints) {
        result.push(input.substring(start, point));
        start = point;
    }
    result.push(input.substring(start));

    return result;
}
