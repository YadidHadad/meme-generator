'use strict'

const arrayWords = ['dasas', 'dada', 'dada', 'dafasf', 'hdhd', 'jlhljh', 'reyye', 'bcvbc',]

var arrayNew = arrayWords.find(word => word.startsWith('d'))

function arrayF() {


    console.log(searchFilter)


    // var imgs = gImgs.filter(img => img.id > 5)

    var imgs = gImgs.filter(img => {
        return img.keywords.find(keyword => { keyword.startsWith(searchFilter) ? true : false }

        )
    })

    console.log(imgs)
    return imgs


}