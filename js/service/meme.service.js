'use strict'

var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2, 'happy': 1, 'crazy': 1, 'sarcastic': 1, 'sad': 1, 'animal': 1 }

var gImgs = [
    { id: 1, url: './img/meme-imgs/1.jpg', keywords: ['funny', 'politics'] },
    { id: 2, url: './img/meme-imgs/2.jpg', keywords: ['dog', 'puppy', 'cute', 'animal'] },
    { id: 3, url: './img/meme-imgs/3.jpg', keywords: ['dog', 'puppy', 'cute', 'baby', 'animal'] },
    { id: 4, url: './img/meme-imgs/4.jpg', keywords: ['kitten', 'cat', 'cute', 'animal'] },
    { id: 5, url: './img/meme-imgs/5.jpg', keywords: ['baby', 'sarcastic'] },
    { id: 6, url: './img/meme-imgs/6.jpg', keywords: ['arcastic', 'funny'] },
    { id: 7, url: './img/meme-imgs/7.jpg', keywords: ['baby', 'cute', 'shock'] },
    { id: 8, url: './img/meme-imgs/8.jpg', keywords: ['sarcastic', 'funny'] },
    { id: 9, url: './img/meme-imgs/9.jpg', keywords: ['sarcastic', 'baby', 'cute', 'funny'] },
    { id: 10, url: './img/meme-imgs/10.jpg', keywords: ['funny', 'politics'] },
    { id: 11, url: './img/meme-imgs/11.jpg', keywords: ['gay', 'sarcastic', 'love', 'funny'] },
    { id: 12, url: './img/meme-imgs/12.jpg', keywords: ['sarcastic', 'funny'] },
    { id: 13, url: './img/meme-imgs/13.jpg', keywords: ['happy', 'toast', 'drink', 'sarcastic'] },
    { id: 14, url: './img/meme-imgs/14.jpg', keywords: ['sarcastic', 'crazy'] },
    { id: 15, url: './img/meme-imgs/15.jpg', keywords: ['funny', 'sarcastic'] },
    { id: 16, url: './img/meme-imgs/16.jpg', keywords: ['funny', 'sarcastic'] },
    { id: 17, url: './img/meme-imgs/17.jpg', keywords: ['funny', 'sarcastic'] },
    { id: 18, url: './img/meme-imgs/18.jpg', keywords: ['funny', 'toys', 'cute'] },

];

var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: -1,
    lines: []
}

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
    console.log(searchFilter)

    var imgs = gImgs.filter(img => {
        var bool = img.keywords.find(keyword => {
            return keyword.startsWith(searchFilter)
        })
        return bool ? true : false
    })

    return imgs
}

function setMemeImg(idx) {
    gMeme.selectedImgId = idx

    const img = getImg(idx)
    updateSearchCount(img.keywords)

}

function setMemeText(lineIdx, text) {
    gMeme.lines[lineIdx].txt = text
}

function updateSearchCount(keywords) {
    console.log(gKeywordSearchCountMap)

    keywords.map((keyword) => {

        if (gKeywordSearchCountMap.hasOwnProperty(keyword)) {
            gKeywordSearchCountMap[keyword] += 1

        } else {
            gKeywordSearchCountMap[keyword] = 1
        }

    })
    console.log(gKeywordSearchCountMap)
}

function getKeywords() {
    return gKeywordSearchCountMap
}

//MEME EDITOR

function addLine(width, height) {


    var x, y
    const linesCount = gMeme.lines.length
    if (linesCount === 0) {
        x = width / 2
        y = 50

    } else if (linesCount === 1) {
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
        txt: '',
        size: 50,
        length: 0,
        align: 'center',
        color: 'white',
        family: 'Impact',
        pos: { x, y },
    }
    console.log(`newLine:`, newLine)
    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx += 1


}

function setFont(font) {
    gMeme.lines[gMeme.selectedLineIdx].family = font
}