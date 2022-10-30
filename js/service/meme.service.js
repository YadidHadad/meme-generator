'use strict'

const MEMES_STORAGE_KEY = 'memesDB'
const KEYWORDS_STORAGE_KEY = 'keywordsDB'

var gKeywordSearchCountMap = { 'funny': 8, 'cat': 16, 'baby': 10, 'happy': 1, 'crazy': 45, 'sarcastic': 16, 'sad': 1, 'animal': 4 }

var gImgs = [
    { id: 1, url: './img/meme-imgs/1.jpg', keywords: ['funny', 'politics'] },
    { id: 2, url: './img/meme-imgs/2.jpg', keywords: ['happy', 'cute', 'musical'] },
    { id: 3, url: './img/meme-imgs/3.jpg', keywords: ['dog', 'puppy', 'cute', 'baby', 'animal'] },
    { id: 4, url: './img/meme-imgs/4.jpg', keywords: ['dog', 'cute', 'animal'] },
    { id: 5, url: './img/meme-imgs/5.jpg', keywords: ['baby', 'sarcastic'], },
    { id: 6, url: './img/meme-imgs/6.jpg', keywords: ['arcastic', 'funny'], },
    { id: 7, url: './img/meme-imgs/7.jpg', keywords: ['baby', 'cute', 'shock'], },
    { id: 8, url: './img/meme-imgs/8.jpg', keywords: ['sarcastic', 'funny'], },
    { id: 9, url: './img/meme-imgs/9.jpg', keywords: ['sarcastic', 'baby', 'cute', 'funny'], },
    { id: 10, url: './img/meme-imgs/10.jpg', keywords: ['funny', 'politics'], },
    { id: 11, url: './img/meme-imgs/11.jpg', keywords: ['gay', 'sarcastic', 'love', 'funny'], },
    { id: 12, url: './img/meme-imgs/12.jpg', keywords: ['sarcastic', 'funny'], },
    { id: 13, url: './img/meme-imgs/13.jpg', keywords: ['happy', 'toast', 'drink', 'sarcastic'], },
    { id: 14, url: './img/meme-imgs/14.jpg', keywords: ['sarcastic', 'crazy'], },
    { id: 15, url: './img/meme-imgs/15.jpg', keywords: ['funny', 'sarcastic'], },
    { id: 16, url: './img/meme-imgs/16.jpg', keywords: ['funny', 'sarcastic'], },
    { id: 17, url: './img/meme-imgs/17.jpg', keywords: ['funny', 'sarcastic'], },
    { id: 18, url: './img/meme-imgs/18.jpg', keywords: ['funny', 'toys', 'cute'], },

]
var gMeme = {
    id: 'jhsdh',
    selectedImgId: 5,
    imgAspectRatio: 1,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'Write Something Funny',
            size: 35,
            length: 0,
            align: 'center',
            color: 'white',
            family: 'gImpact',
            pos: { x: 200, y: 50 },
            isDrag: false,
        },
    ]
}

var gMemes

// STORAGE CHECK
function loadSaves() {
    // debugger
    if (!loadMemesfromStorage()) gMemes = []
    else gMemes = loadMemesfromStorage()

    if (!loadKeywordsfromStorage()) saveKeywordsToStorage()
    else gKeywordSearchCountMap = loadKeywordsfromStorage()

}

// STORAGE
function saveMemesToStorage() {
    if (!gMeme) return
    saveToStorage(MEMES_STORAGE_KEY, gMemes)
}

function loadMemesfromStorage() {
    return loadFromStorage(MEMES_STORAGE_KEY)
}

function saveKeywordsToStorage() {
    if (!gMemes) return
    saveToStorage(KEYWORDS_STORAGE_KEY, gKeywordSearchCountMap)
}

function loadKeywordsfromStorage() {
    return loadFromStorage(KEYWORDS_STORAGE_KEY)
}

// DATA MODEL FUNCTIONS
function getMeme() {
    return gMeme
}

function getImg(id) {
    return gImgs.find((img) => img.id === id)
}

function getImages(searchFilter) {
    // if input is empty rreturn all gImages
    if (!searchFilter) return gImgs
    //if not turn the value to lower case and filter
    var searchFilter = searchFilter.toLowerCase()
    // console.log(searchFilter)

    var imgs = gImgs.filter(img => {
        var bool = img.keywords.find(keyword => {
            return keyword.startsWith(searchFilter)
        })
        return bool ? true : false
    })
    return imgs
}

function setMemeImg(idx, url) {
    const aspectRatio = getAspectRatio(url)

    gMeme.selectedImgId = idx
    gMeme.imgAspectRatio = aspectRatio

}

function setMemeText(lineIdx, txt) {
    gMeme.lines[lineIdx].txt = txt
}

function updateSearchCount(keyword) {

    if (gKeywordSearchCountMap.hasOwnProperty(keyword)) {
        gKeywordSearchCountMap[keyword] += 1
    } else {
        gKeywordSearchCountMap[keyword] = 1
    }

    saveKeywordsToStorage()
    gKeywordSearchCountMap = loadKeywordsfromStorage()

}

function getKeywords() {
    return gKeywordSearchCountMap
}

//MEME EDITOR

function addLine(width, height) {
    var x, y

    if (gMeme.lines.length === 0) {
        x = width / 2
        y = 50

    } else if (gMeme.lines.length === 1) {
        x = width / 2
        y = height - 50

    } else {
        x = width / 2
        y = height / 2
    }

    createLine(x, y)
}

function createLine(x, y) {

    const newLine = {
        txt: 'Write Something Funny',
        size: 35,
        length: 0,
        align: 'center',
        color: 'white',
        family: 'gImpact',
        pos: { x, y },
        isDrag: false,
    }
    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx += 1
}

function deleteLine() {
    if (gMeme.lines.length <= 1) return false
    gMeme.lines.splice([gMeme.selectedLineIdx], 1)
    return true
}

function setFamily(font) {
    gMeme.lines[gMeme.selectedLineIdx].family = font
}

function setColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
}

function setSize(value) {
    gMeme.lines[gMeme.selectedLineIdx].size += value
}

function setAlign(value, canvasWidth) {

    if (value === 'right') gMeme.lines[gMeme.selectedLineIdx].pos.x = 20 + gMeme.lines[gMeme.selectedLineIdx].length / 2
    if (value === 'left') gMeme.lines[gMeme.selectedLineIdx].pos.x = canvasWidth - 20 - gMeme.lines[gMeme.selectedLineIdx].length / 2
    if (value === 'center') gMeme.lines[gMeme.selectedLineIdx].pos.x = canvasWidth / 2
}

function toggleSelectedLine() {
    if (gMeme.selectedLineIdx === 0) gMeme.selectedLineIdx = gMeme.lines.length - 1
    else gMeme.selectedLineIdx--
}

function setSelectedLine(lineIdx) {
    gMeme.selectedLineIdx = lineIdx
}

function setLineDrag(isDrag) {
    gMeme.lines[gMeme.selectedLineIdx].isDrag = isDrag
}

function setLinePos(pos) {
    gMeme.lines[gMeme.selectedLineIdx].pos = pos
}

function setYPos(value) {
    gMeme.lines[gMeme.selectedLineIdx].pos.y += value
}

// SAVE
function saveMeme() {
    gMemes.unshift(gMeme)
    saveMemesToStorage()
    gMemes = loadMemesfromStorage()
}

function getSavedMemes() {
    return gMemes
}

function setCurrMemeToRender(meme) {
    gMeme = meme
}