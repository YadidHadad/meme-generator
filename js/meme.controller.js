'use strict'

let gElCanvas
let gCtx
let gStartPos
let gUploadSrc

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

function onInit() {
    loadSaves()
    setCanvas()
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
    const pos = getEvPos(ev)
    const newSelectedLineIdx = lineClicked(pos)
    setSelectedLine(newSelectedLineIdx)
    if (newSelectedLineIdx < 0) {
        document.body.style.cursor = 'cursor'
        return
    }
    setMemeTextInput()
    setLineDrag(true)
    gStartPos = pos
    drawFrame()
    gElCanvas.style.cursor = 'grabbing'
}

function onMove(ev) {
    const { lines, selectedLineIdx } = getMeme()
    if (selectedLineIdx < 0) return
    if (!lines[selectedLineIdx].isDrag) return

    const newPos = getEvPos(ev)
    const dx = newPos.x - gStartPos.x
    const dy = newPos.y - gStartPos.y

    moveLine(dx, dy)
    gStartPos = newPos
    renderMeme()
}

function onUp() {
    const { newSelectedLineIdx } = getMeme()
    if (newSelectedLineIdx < 0) return
    setLineDrag(false)
    gElCanvas.style.cursor = 'grab'
    renderMeme()
}

function moveLine(dx, dy) {
    const { selectedLineIdx, lines } = getMeme()
    const currPos = lines[selectedLineIdx].pos
    currPos.x += dx
    currPos.y += dy
}

function getEvPos(ev) {
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
        return (clickedPos.x > lineStart && clickedPos.x < lineEnd) && (clickedPos.y > lineTop && clickedPos.y < lineBottom)

    })
    return selectedLineIdx
}

// GALLERY
function renderGallery(searchFilter) {

    if (searchFilter) {
        setGalleryTextInput(searchFilter)
        updateSearchCount(searchFilter)
    }

    const imgsGallery = document.querySelector('.grid-images-container')
    const imgs = getImages(searchFilter)
    const strHTML = imgs.map((img) => {
        return `
                <img id="${img.id}" class="grid-item" current-meme-img" src=${img.url} alt="" onClick="onSetMemeImg(${img.id}, this.src);">`
    })

    imgsGallery.innerHTML = strHTML.join('')
}

function renderKeywords() {
    const keywordsMap = getKeywords()
    const keywords = Object.keys(keywordsMap)
    const strHTML = keywords.map((keyword) => {
        let fontSize
        if (keywordsMap[keyword] > 10) fontSize = '2'
        else if (keywordsMap[keyword] > 5) fontSize = '1.5'
        else fontSize = '1'
        return `<div class="search-keyword" value="${keyword}" style="font-size: ${fontSize}rem ;" onclick="renderGallery('${keyword}'); renderKeywords()">${keyword}</div>`
    })
    document.querySelector('.common-search-values').innerHTML = strHTML.join('')
    saveKeywordsToStorage()
}

function setGalleryTextInput(searchFilter) {
    const element = document.querySelector('.search-input')
    element.value = searchFilter
}

// CANVAS
function setCanvas() {
    gElCanvas = document.querySelector('#canvas')
    gCtx = gElCanvas.getContext('2d')
}

function setCanvasAspectRatio() {
    const { url } = getMeme()
    gElCanvas.height = gElCanvas.width
    gElCanvas.height *= getAspectRatio(url)

}

function renderMeme() {
    clearCanvas()
    var { selectedImgId, lines, selectedLineIdx, url } = getMeme()

    const img = new Image()
    img.src = url
    renderImg(img)

    // render text lines
    if (lines.length < 1) {
        resetMemeTextInput()
    } else {
        lines.map(line => {
            const x = line.pos.x
            const y = line.pos.y
            drawText(line, x, y)
        })
    }
    if (lines[selectedLineIdx]) drawFrame()
}

function onSetMemeTxt(txt) {
    setMemeText(txt)
    renderMeme()
}

function onSetMemeImg(idx, url) {
    setMemeImg(idx, url)
    setCanvas()
    setCanvasAspectRatio()
    resetMemeTextInput()
    renderMeme()
    showEditor()
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

function onDrawSticker(value) {
    addLine(gElCanvas.width, gElCanvas.height)
    setSize(20)
    setMemeText(value)
    renderMeme()
}

function drawText(line, x, y) {
    gCtx.textBaseline = 'middle'
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = line.color
    gCtx.textAlign = line.align
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
    // drawArc(lineStart, lineTop)
}

function drawRectangle(x, y, width, height) {
    gCtx.beginPath()
    gCtx.rect(x, y, width, height)
    gCtx.strokeStyle = "#FF0000";
    gCtx.stroke()

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

function renderImg(img) {

    // Draw the img on the canvas
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
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

function onSetLine(property, value) {

    const { selectedImgId, selectedLineIdx, lines } = getMeme()
    if (selectedLineIdx < 0) return
    if (property === 'family') {
        setFamily(value)
        document.querySelector('.text-editor').style.fontFamily = value
    }
    else if (property === 'color') {
        setColor(value)
        document.querySelector('.color-picker').style.backgroundColor = value
    }
    else if (property === 'size') { setSize(+value) }
    else if (property === 'align') { setAlign(value, gElCanvas.width) }
    else if (property === 'moveUp') { setYPos(-10) }
    else if (property === 'moveDown') { setYPos(10) }

    renderMeme()
}

// SHOW HIDE COMPONENETS
function onShowGallery() {
    document.querySelector('[name="image-gallery"]').classList.remove('hide')
    document.querySelector('[name="meme-editor"]').classList.add('hide')
    document.querySelector('[name="memes-saved"]').classList.add('hide')
    gUploadSrc = null
}

function showEditor() {
    document.querySelector('[name="image-gallery"]').classList.add('hide')
    document.querySelector('[name="meme-editor"]').classList.remove('hide')
    document.querySelector('[name="memes-saved"]').classList.add('hide')

}

function onShowSavedMemes() {
    document.querySelector('[name="image-gallery"]').classList.add('hide')
    document.querySelector('[name="meme-editor"]').classList.add('hide')
    document.querySelector('[name="memes-saved"]').classList.remove('hide')
    renderSavedMemes()
}

function alertUser(value) {
    const el = document.querySelector('[name="modal-alert"]')
    el.innerHTML = value
    el.classList.remove('hide')
    document.querySelector('.main-screen').classList.add('show-screen')
}

function showShareModal() {
    document.querySelector('[name="modal-share"]').classList.remove('hide')
    document.querySelector('.main-screen').classList.add('show-screen')
}

function onHideModals() {
    document.querySelector('[name="modal-alert"]').classList.add('hide')
    document.querySelector('[name="modal-share"]').classList.add('hide')
    document.querySelector('[name="modal-upload"]').classList.add('hide')
    document.querySelector('.main-screen').classList.remove('show-screen')
}

function onShowUploadModal(ev) {
    document.querySelector('[name="modal-upload"]').classList.remove('hide')
    document.querySelector('.main-screen').classList.add('show-screen')

}

// SAVED MEMES
function onSaveMeme() {
    var dataURL = gElCanvas.toDataURL()
    var meme = getMeme()
    meme['dataURL'] = dataURL

    saveMeme()
    alertUser('Meme saved!')
}

function onSetAndEditSavedMeme(idx) {
    gUploadSrc = null
    const savedMems = getSavedMemes()
    setCurrMemeToRender(savedMems[idx])
    setCanvas()
    setCanvasAspectRatio()
    renderMeme()
    showEditor()
    savedMems.splice(idx, 1)
}

function renderSavedMemes() {

    var savedMemes = loadMemesfromStorage()
    if (!savedMemes) {
        document.querySelector('.saved-container').innerHTML = '<h2>fill me up with your creations!</h2>'
        return
    }

    document.querySelector('.saved-container').classList.add('grid-saved-container')
    var strHTMLs = savedMemes.map((meme, idx) => `
    <img class="saved-meme-img" src="${meme.dataURL}" onclick="onSetAndEditSavedMeme(${idx})">`
    )

    document.querySelector('.saved-container').innerHTML = strHTMLs.join('')
}

// UPLOAD IMAGE
function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
}

// CallBack func will run on success load of the img
function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader()
    // After we read the file
    reader.onload = function (event) {
        let img = new Image() // Create a new html img element
        img.src = event.target.result // Set the img src to the img file we read
        // Run the callBack func, To render the img on the canvas
        // console.log(img.onload.height)
        // img.onload = onImageReady.bind(null, img)
        // Can also do it this way:
        img.onload = () => {
            const aspectRatio = img.height / img.width
            gElCanvas.height = gElCanvas.width
            gElCanvas.height *= aspectRatio
            onImageReady(img)
            gUploadSrc = img.src
            setMemeImg(-1, gUploadSrc)
            renderMeme()
            onHideModals()
            showEditor()
        }
    }
    reader.readAsDataURL(ev.target.files[0]) // Read the file we picked
}

//DOWNLOAD
function downloadImg(elLink) {
    const imgContent = gElCanvas.toDataURL('image/jpeg')// image/jpeg the default format
    elLink.href = imgContent
}
