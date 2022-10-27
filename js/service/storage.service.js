'use strict'

const MEMES_STORAGE_KEY = 'memesDB'
const KEYWORDS_STORAGE_KEY = 'keywordsDB'

function saveToStorage(key, val) {
    const str = JSON.stringify(val)
    localStorage.setItem(key, str)
}

function loadFromStorage(key) {
    const str = localStorage.getItem(key)
    return JSON.parse(str)
}

function clearStorage() {
    localStorage.clear()
}
