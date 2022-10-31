
'use strict'

var gImpact
var gBowlbyOne
var gBungee
var gIFrdokaOne
var gRighteous
var gOleoScriptRegular
var gOleoScriptBold
var gFASolid
var gFABrands

setFonts()

// FONTS
function setFonts() {
    gImpact = new FontFace('gImpact', 'url(./fonts/impact/impact.ttf)')
    gImpact.load().then(function (font) {
        document.fonts.add(font)
        console.log('gImpact loaded')
    })

    gBowlbyOne = new FontFace('gBowlbyOne', 'url(./fonts/BowlbyOne/BowlbyOne-Regular.ttf)')
    gBowlbyOne.load().then(function (font) {
        document.fonts.add(font)
        console.log('gBowlbyOne loaded')

    })

    gBungee = new FontFace('gBungee', 'url(./fonts/Bungee/Bungee-Regular.ttf)')
    gBungee.load().then(function (font) {
        document.fonts.add(font)
        console.log('gBungee loaded')

    })

    gIFrdokaOne = new FontFace('gIFrdokaOne', 'url(./fonts/FredokaOne/FredokaOne-Regular.ttf)')
    gIFrdokaOne.load().then(function (font) {
        document.fonts.add(font)
        console.log('gIFrdokaOne loaded')

    })

    gRighteous = new FontFace('gRighteous', 'url(./fonts/Righteous/Righteous-Regular.ttf)')
    gRighteous.load().then(function (font) {
        document.fonts.add(font)
        console.log('gRighteous loaded')
    })

    gRighteous = new FontFace('gRighteous', 'url(./fonts/Righteous/Righteous-Regular.ttf)')
    gRighteous.load().then(function (font) {
        document.fonts.add(font)
        console.log('gRighteous loaded')
    })

    gOleoScriptRegular = new FontFace('gOleoScriptRegular', 'url(./fonts/OleoScript/OleoScript-Regular.ttf)')
    gOleoScriptRegular.load().then(function (font) {
        document.fonts.add(font)
        console.log('gOleoScriptRegular loaded')
    })

    gOleoScriptBold = new FontFace('gOleoScriptBold', 'url(./fonts/OleoScript/OleoScript-Bold.ttf)')
    gOleoScriptBold.load().then(function (font) {
        document.fonts.add(font)
        console.log('gOleoScriptBold loaded')
    })

    gFASolid = new FontFace('gFASolid', 'url(./fonts/fa/fa-solid-900.ttf)')
    gFASolid.load().then(function (font) {
        document.fonts.add(font)
        console.log('gFASolid loaded')
    })
    gFABrands = new FontFace('gFABrands', 'url(./fonts/fa/fa-brands-400.ttf)')
    gFABrands.load().then(function (font) {
        document.fonts.add(font)
        console.log('gFABrands loaded')
    })
}

