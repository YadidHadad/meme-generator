'use strict'

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

// EVENT LISTENERES
function addListeners() {
    addMouseListeners()
    addTouchListeners()
    //Listen for resize ev 
    window.addEventListener('resize', () => {
        resizeCanvas()
        clearCanvas()
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
    clearCanvas()

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
                <img id="${img.id}" class="grid-item" current-meme-img" src=${img.url} alt="" onClick="onSetMemeImg(idx = ${img.id});renderMeme(idx = ${img.id}, ev = event);">`
    })

    imgsGallery.innerHTML = strHTML.join('')
    // console.log(strHTML.join(''))

}

function renderKeywords() {

    const keywordsMap = getKeywords()

    const keywords = Object.keys(keywordsMap)
    console.log(keywords)
    const strHTML = keywords.map((keyword) => {
        let fontSize
        if (keywordsMap[keyword] > 10) fontSize = '2'
        else if (keywordsMap[keyword] > 5) fontSize = '1.5'
        else fontSize = '1'

        return `<div class="search-keyword" value="${keyword}" style="font-size: ${fontSize}rem ;" onclick="renderGallery('${keyword}')">${keyword}</div>`
    })

    document.querySelector('.common-search-values').innerHTML = strHTML.join('')

}

// CANVAS
function renderMeme(idx, text, ev) {
    //GET DATA
    const { lines, selectedLineIdx } = getMeme()

    // UPDATE MODEL
    if (idx) setMemeImg(idx)
    if (text && lines.length > 0) setMemeText(selectedLineIdx, text)

    //GET DATA
    const { selectedImgId } = getMeme()

    // clear Canvas
    clearCanvas()

    // render Image
    const elImg = document.getElementById(selectedImgId);
    console.log((elImg))
    if (elImg) gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
    else return

    // render text lines
    if (text) {

        if (lines.length < 1) {
            resetMemeTextInput()
        } else {
            lines.map(line => {

                const x = line.pos.x
                const y = line.pos.y
                drawText(line.txt, line, x, y)
            })
        }
    }
}

function onSetMemeImg(idx) {
    setMemeImg(idx)
    // SHOW HIDE SECTIONS

    toggleHide('meme-editor')
    toggleHide('image-gallery')


}

function resetMemeTextInput() {
    const element = document.querySelector('.text-editor')
    element.value = ''

}

function drawText(text, line, x, y) {
    console.log(`line:`, line)

    const textLength = gCtx.measureText(text).width
    line.length = textLength

    gCtx.textBaseline = 'middle'

    // const text = line
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = line.color
    gCtx.textAlign = line.align;
    gCtx.font = `${line.size}px ${line.family}`
    console.log(`${line.size}px ${line.family}`)
    gCtx.fillText(text, x, y) // Draws (fills) a given text at the given (x, y) position.
    gCtx.strokeText(text, x, y) // Draws (strokes) a given text at the given (x, y) position.
    if (textLength > gElCanvas.width - 40) {
        alert('Text too long!')
        return
    }
}

function drawRectangle() {
    gCtx.beginPath();
    gCtx.rect(20, 20, 150, 100);
    gCtx.stroke();
}

function clearCanvas() {
    //Set the backgournd color to grey 
    // gCtx.fillStyle = "#ede5ff"
    //Clear the canvas,  fill it with grey background
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)

}

function onMemeLine(text) {
    const { selectedLineIdx, lines } = getMeme()
    const line = lines[selectedLineIdx]
    setMemeText(selectedLineIdx, text)
    console.log(text)
    const x = gElCanvas / 2
    const y = 50
    drawText(text, line, x, y)

}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    // console.log(`elContainer:`, elContainer)
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}

//MEME EDITOR

function onAddLine() {
    addLine(gElCanvas.width, gElCanvas.height)
    resetMemeTextInput()
}

function onSetFont(font) {
    setFont(font)

    const { selectedImgId, selectedLineIdx, lines } = getMeme()
    if (!lines[selectedLineIdx].txt) return
    renderMeme(selectedImgId, lines[selectedLineIdx].txt)

}

// SHOW HIDE ELEMENTS

function toggleHide(elementName) {
    console.log('hide')
    document.querySelector(`[name="${elementName}"]`).classList.toggle('hide')
}
// function hideElement(elementName) {
//     document.querySelector(`[name="${elementName}"]`).classList.toggle('hide')
// }

// onShowGallery(){

// }
