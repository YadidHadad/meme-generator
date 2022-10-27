'use strict'

var gImpact
var gBowlbyOne
var gBungee
var gIFrdokaOne
var gRighteous

let gElCanvas = {}
let gCtx
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']


function onInit() {
    setFonts()

    gElCanvas = resizeCanvas()
    gElCanvas = document.querySelector('#canvas')
    gCtx = gElCanvas.getContext('2d')

    renderGallery()
    renderKeywords()
    addListeners()
}

// EVENT LISTENERES
function addListeners() {
    addMouseListeners()
    addTouchListeners()
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

// CANVAS INTERACTIONS
function onDown(ev) {
    // console.log('Im from onDown')
    const pos = getEvPos(ev)
    const newSelectedLineIdx = lineClicked(pos)
    if (newSelectedLineIdx < 0) return
    setSelectedLine(newSelectedLineIdx)
    setMemeTextInput()
    setLineDrag(true)

    drawFrame()
    document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
    // console.log('Im from onMove')
    const { lines, selectedLineIdx } = getMeme()
    if (!lines[selectedLineIdx].isDrag) return

    const currPos = lines[selectedLineIdx].pos
    const newPos = getEvPos(ev)
    const dx = newPos.x - currPos.x
    const dy = newPos.y - currPos.y

    moveLine(dx, dy)
    renderMeme()
}

function onUp() {
    // console.log('Im from onUp')
    setLineDrag(false)
    document.body.style.cursor = 'cursor'
    renderMeme()
}

function moveLine(dx, dy) {
    const { selectedLineIdx, lines } = getMeme()
    const currPos = lines[selectedLineIdx].pos
    currPos.x += dx
    currPos.y += dy
}

function getEvPos(ev) {
    // console.log(ev)
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (TOUCH_EVS.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}

function lineClicked(clickedPos) {
    const { lines } = getMeme()
    const selectedLineIdx = lines.findIndex(line => {

        const currPos = line.pos
        const lineStart = currPos.x - (line.length / 2)
        const lineEnd = currPos.x + (line.length / 2)
        const lineTop = currPos.y - (line.size / 2)
        const lineBottom = currPos.y + (line.size / 2)
        const bool = (clickedPos.x > lineStart && clickedPos.x < lineEnd) && (clickedPos.y > lineTop && clickedPos.y < lineBottom)
        return bool
    })
    return selectedLineIdx
}

// RENDER GALLERY
function renderGallery(searchFilter) {
    const imgsGallery = document.querySelector('.grid-container')
    const imgs = getImages(searchFilter)
    const strHTML = imgs.map((img) => {
        return `
                <img id="${img.id}" class="grid-item" current-meme-img" src=${img.url} alt="" onClick="onSetMemeImg(${img.id});renderMeme(${img.id});">`
    })

    imgsGallery.innerHTML = strHTML.join('')
    if (searchFilter) setGalleryTextInput(searchFilter)
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
    saveKeywordsToStorage()
}

function setGalleryTextInput(searchFilter) {
    const element = document.querySelector('.search')
    element.value = searchFilter
}

// CANVAS
function renderMeme(idx, text) {
    //GET DATA
    var { selectedImgId, lines, selectedLineIdx } = getMeme()

    // UPDATE MODEL
    if (idx) setMemeImg(idx)
    if (text) setMemeText(selectedLineIdx, text)

    //GET DATA
    var { selectedImgId, lines, selectedLineIdx } = getMeme()

    // clear Canvas
    clearCanvas()

    // render Image
    const elImg = document.getElementById(selectedImgId);
    if (elImg) gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
    else return

    // render text lines
    if (lines.length < 1) {
        resetMemeTextInput()
    } else {
        lines.map(line => {
            // console.log(`line:`, line)
            const x = line.pos.x
            const y = line.pos.y
            drawText(line, x, y)
        })
    }
    if (lines[selectedLineIdx].isDrag) drawFrame()
}

function onSetMemeImg(idx) {
    setMemeImg(idx)
    toggleHide('meme-editor')
    toggleHide('image-gallery')
}

function resetMemeTextInput() {
    const element = document.querySelector('.text-editor')
    element.value = ''
}

function setMemeTextInput() {
    const { selectedLineIdx, lines } = getMeme()
    const element = document.querySelector('.text-editor')
    element.value = lines[selectedLineIdx].txt
}

function drawText(line, x, y) {
    gCtx.textBaseline = 'middle'
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = line.color
    gCtx.textAlign = line.align;
    gCtx.font = `${line.size}px ${line.family}`

    const textLength = gCtx.measureText(line.txt).width
    line.length = textLength
    gCtx.fillText(line.txt, x, y) // Draws (fills) a given text at the given (x, y) position.
    gCtx.strokeText(line.txt, x, y) // Draws (strokes) a given text at the given (x, y) position.
}

function drawFrame() {
    const { selectedLineIdx, lines } = getMeme()
    const line = lines[selectedLineIdx]
    const lineWidth = line.length
    const lineHeight = line.size
    const lineStart = line.pos.x - (line.length / 2)
    const lineTop = line.pos.y - (line.size / 2)

    drawRectangle(lineStart, lineTop, lineWidth, lineHeight)
    drawArc(lineStart, lineTop)
}

function drawRectangle(x, y, width, height) {
    gCtx.beginPath();
    gCtx.rect(x, y, width, height);
    gCtx.stroke();
}

function drawArc(x, y, size = 5, color = 'blue') {
    gCtx.beginPath()
    gCtx.lineWidth = '6'
    gCtx.arc(x, y, size, 0, 2 * Math.PI)
    gCtx.fillStyle = color
    gCtx.fill()
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function onMemeLine(text) {
    const { selectedLineIdx, lines } = getMeme()
    const line = lines[selectedLineIdx]
    setMemeText(selectedLineIdx, text)
    const x = gElCanvas / 2
    const y = 50
    drawText(text, line, x, y)
}

function downloadImg(elLink) {
    const imgContent = gElCanvas.toDataURL('image/jpeg')// image/jpeg the default format
    elLink.href = imgContent
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}

//MEME EDITOR
function onAddLine() {
    addLine(gElCanvas.width, gElCanvas.height)
    resetMemeTextInput()
    renderMeme()
}

function onDeleteLine() {
    if (!deleteLine()) return
    toggleSelectedLine()
    resetMemeTextInput()
    const { selectedLineIdx, lines } = getMeme()
    if (lines[selectedLineIdx] < 0) renderMeme()
    else renderMeme()
}

function onToggleSelectedLine() {
    toggleSelectedLine()
    setMemeTextInput()
    renderMeme()
    drawFrame()
}

function onSetLine(style, value) {
    const { selectedImgId, selectedLineIdx, lines } = getMeme()
    if (selectedLineIdx < 0) return
    if (style === 'family') setFamily(value)
    else if (style === 'color') setColor(value)
    else if (style === 'size') setSize(+value)
    else if (style === 'align') setAlign(value)
    else if (style === 'moveUp') setYPos(10)
    else if (style === 'moveDown') setYPos(-10)

    renderMeme(selectedImgId, lines[selectedLineIdx].txt)
}

// SHOW HIDE ELEMENTS
function toggleHide(elementName) {
    document.querySelector(`[name="${elementName}"]`).classList.toggle('hide')
}

function onShowGallery() {
    document.querySelector('[name="image-gallery"]').classList.remove('hide')
    document.querySelector('[name="meme-editor"]').classList.add('hide')

}

function onAlertUser(value) {
    const el = document.querySelector('[name="modal-alert"]')
    el.innerHTML = value
    el.classList.remove('hide')

    setTimeout(() => {
        document.querySelector('[name="modal-alert"]').classList.add('hide')

    }, 2500);

}

// FONTS
function setFonts() {
    gImpact = new FontFace('gImpact', 'url(./fonts/impact/impact.ttf)');
    gImpact.load().then(function (font) {
        document.fonts.add(font);
        console.log('gImpact loaded');

    })

    gBowlbyOne = new FontFace('gBowlbyOne', 'url(./fonts/BowlbyOne/BowlbyOne-Regular.ttf)');
    gBowlbyOne.load().then(function (font) {
        document.fonts.add(font);
        console.log('gBowlbyOne loaded');

    })

    gBungee = new FontFace('gBungee', 'url(./fonts/Bungee/Bungee-Regular.ttf)');
    gBungee.load().then(function (font) {
        document.fonts.add(font);
        console.log('gBungee loaded');

    })

    gIFrdokaOne = new FontFace('gIFrdokaOne', 'url(./fonts/FredokaOne/FredokaOne-Regular.ttf)');
    gIFrdokaOne.load().then(function (font) {
        document.fonts.add(font);
        console.log('gIFrdokaOne loaded');

    })

    gRighteous = new FontFace('gRighteous', 'url(./fonts/Righteous/Righteous-Regular.ttf)');
    gRighteous.load().then(function (font) {
        document.fonts.add(font);
        console.log('gRighteous loaded');
    })
}

