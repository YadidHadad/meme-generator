'use strict'


let gTextStrokeColor = '#000000'
let gTextFillColor = '#FFFFFF'
let gTextSize = '2rem'
let gTextFamily = 'Arial'
let gTextAlign = 'center'

let gElCanvas = {}
let gCtx

function onInit() {

    gElCanvas = resizeCanvas()
    gElCanvas = document.querySelector('#canvas')
    gCtx = gElCanvas.getContext('2d')

    renderGallery()
    renderKeywords()
    addListeners()
}


function renderMeme(elImg, id) {
    // get meme data from service
    const { selectedImgId, selectedLineIdx, lines } = getMeme()

    console.log(elImg)

    setMemeImg(id)

    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
    drawText(lines[selectedLineIdx].txt, gElCanvas.width / 2, 10)
}

// RESIZE CANVAS
function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    // console.log(`elContainer:`, elContainer)
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}

// CANVAS ACTIONS
// IMG
function drawImg(src) {
    const elImg = document.querySelector('.current-meme-img')
    elImg.src = src
    // const img = document.querySelector('img')
    // Naive approach:
    // there is a risk that image is not loaded yet and nothing will be drawn on canvas
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height) // Draws the specified image
}

// TEXT
function drawText(text, x, y) {
    console.log(text)
    console.log(x, y)
    gCtx.textBaseline = "top";
    gCtx.lineWidth = 2
    gCtx.strokeStyle = gTextStrokeColor
    gCtx.fillStyle = gTextFillColor
    gCtx.textAlign = 'center';
    gCtx.font = `${gTextSize} ${gTextFamily}`
    gCtx.fillText(text, x, y) // Draws (fills) a given text at the given (x, y) position.
    gCtx.strokeText(text, x, y) // Draws (strokes) a given text at the given (x, y) position.
}


// EVENT LISTENERES

function addListeners() {
    addMouseListeners()
    addTouchListeners()
    //Listen for resize ev 
    window.addEventListener('resize', () => {
        resizeCanvas()
        renderCanvas()
    })
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

// EVENTS
function onDown(ev) {
    console.log('Im from onDown')
    //Get the ev pos from mouse or touch
    const pos = getEvPos(ev)
    if (!isCircleClicked(pos)) return
    setCircleDrag(true)
    //Save the pos we start from 
    gStartPos = pos
    document.body.style.cursor = 'grabbing'

}

function onMove(ev) {
    console.log('Im from onMove')
    const { isDrag } = getCircle()
    if (!isDrag) return
    const pos = getEvPos(ev)
    //Calc the delta , the diff we moved
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    moveCircle(dx, dy)
    //Save the last pos , we remember where we`ve been and move accordingly
    gStartPos = pos
    //The canvas is render again after every move
    renderCanvas()

}

function onUp() {
    console.log('Im from onUp')
    setCircleDrag(false)
    document.body.style.cursor = 'grab'
}

// RENDER GALLERY

function renderGallery(searchFilter) {
    console.log(searchFilter)

    const imgsGallery = document.querySelector('.grid-container')
    const imgs = getImages(searchFilter)

    const strHTML = imgs.map((img) => {
        return `
                <img id="${img.id}" class="grid-item" current-meme-img" src=${img.url} alt="" onClick="renderMeme(this, ${img.id})">`
    })

    imgsGallery.innerHTML = strHTML.join('')
    // console.log(strHTML.join(''))

}

function renderKeywords() {

    const keywordsMap = getKeywords()

    const keywords = Object.keys(keywordsMap)

    const strHTML = keywords.map((keyword) => {
        let fontSize
        if (keywordsMap[keyword] > 10) fontSize = '2'
        else if (keywordsMap[keyword] > 5) fontSize = '1.5'
        else fontSize = '1'

        return `<div class="search-keyword" value="${keyword}" style="font-size: ${fontSize}rem ;" onclick="renderGallery('${keyword}')">${keyword}</div>`
    })

    document.querySelector('.common-search-values').innerHTML = strHTML.join('')

}