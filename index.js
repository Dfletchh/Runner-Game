
const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')

// static play area 16 x 9 screen
canvas.width = 1024
canvas.height = 535

const gravity = 0.9

class Player {
    constructor() {
        this.speed = 10
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 1
        }
        this.width = 66
        this.height = 150
        this.image = createImage('./img/spriteStandRight.png')
        this.frames = 0
        this.sprites = {
            stand: {
                right: createImage('./img/spriteStandRight.png'),
                left: createImage('./img/spriteStandLeft.png'),
                cropWidth: 177,
                width: 66
            },
            run: {
                right: createImage('./img/spriteRunRight.png'),
                left: createImage('./img/spriteRunleft.png'),
                cropWidth: 341,
                width: 127.875
            }
        }
        this.currentSprite = this.sprites.stand.right
        this.currentCropWidth = this.sprites.stand.cropWidth
    }

    draw() {
        c.drawImage(
            this.currentSprite,
            this.currentCropWidth * this.frames, // crop sprite
            0,
            this.currentCropWidth,
            400,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }

    update() {
        this.frames++
        if (this.frames > 59 && (
            this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left
        )) {
            this.frames = 0
        } else if (this.frames > 29 && (
            this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left
        )) {
            this.frames = 0
        }
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // Fall until bottom of ground
        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity  // accelerating over time
        // else this.velocity.y = 0
    }
}
class Platform {
    constructor({ x, y, image }) {
        this.position = { x, y }
        this.image = image
        this.width = image.width
        this.height = image.height * .001
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}
class Scene {
    constructor({ x, y, image }) {
        this.position = { x, y }
        this.image = image
        this.width = image.width
        this.height = image.height * .001
    }

    draw() {
        // c.fillStyle = 'black'
        c.drawImage(this.image, this.position.x, this.position.y)
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

function createImage(source) {
    const image = new Image()
    image.src = source
    return image
}

let platformImg = createImage('./img/platform.png')
let jumpPlatformImg = createImage('./img/jumpPlatform.png')
let player = new Player()
let platforms = []
let scenes = []
let scrollOffset = 0
let lastKey
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

function init() {
    const platformOffset = platformImg.width - jumpPlatformImg.width
    player = new Player()
    platforms = [

        // Jump Platforms //
        new Platform({ x: platformImg.width * 3 + 350 + platformOffset, y: 200, image: jumpPlatformImg }),   // back
        new Platform({ x: platformImg.width * 3 + 250 + platformOffset, y: 310, image: jumpPlatformImg }),   // top

        new Platform({ x: platformImg.width * 4 + 680 + platformOffset, y: 140, image: jumpPlatformImg }),   // back
        new Platform({ x: platformImg.width * 4 + 790 + platformOffset, y: 230, image: jumpPlatformImg }),   // middle
        new Platform({ x: platformImg.width * 4 + 580 + platformOffset, y: 320, image: jumpPlatformImg }),   // top

        new Platform({ x: platformImg.width * 6 + 593 + platformOffset, y: 220, image: jumpPlatformImg }),   // back
        new Platform({ x: platformImg.width * 6 + 490 + platformOffset, y: 315, image: jumpPlatformImg }),   // top

        new Platform({ x: platformImg.width * 8 + 795 + platformOffset, y: 140, image: jumpPlatformImg }),   // back
        new Platform({ x: platformImg.width * 8 + 905 + platformOffset, y: 230, image: jumpPlatformImg }),   // middle
        new Platform({ x: platformImg.width * 8 + 695 + platformOffset, y: 320, image: jumpPlatformImg }),   // top

        new Platform({ x: platformImg.width * 9 + 1480 + platformOffset, y: 210, image: jumpPlatformImg }),   // back
        new Platform({ x: platformImg.width * 9 + 1280 + platformOffset, y: 310, image: jumpPlatformImg }),   // top

        new Platform({ x: platformImg.width * 10 + 2000 + platformOffset, y: 230, image: jumpPlatformImg }),  // back (extends down)
        new Platform({ x: platformImg.width * 10 + 2000 + platformOffset, y: 140, image: jumpPlatformImg }),  // back
        new Platform({ x: platformImg.width * 10 + 2000 + platformOffset, y: 140, image: platformImg }),      // extend/raise # 10
        new Platform({ x: platformImg.width * 10 + 1900 + platformOffset, y: 230, image: jumpPlatformImg }),  // middle
        new Platform({ x: platformImg.width * 10 + 1800 + platformOffset, y: 320, image: jumpPlatformImg }),  // top

        new Platform({ x: platformImg.width * 11 + 3000 + platformOffset, y: 230, image: jumpPlatformImg }),  // back (extends down)
        new Platform({ x: platformImg.width * 11 + 3000 + platformOffset, y: 140, image: jumpPlatformImg }),  // back
        new Platform({ x: platformImg.width * 11 + 3000 + platformOffset, y: 140, image: platformImg }),      // begin raised floor
        new Platform({ x: platformImg.width * 12 + 2997 + platformOffset, y: 140, image: platformImg }),
        new Platform({ x: platformImg.width * 13 + 2994 + platformOffset, y: 140, image: platformImg }),      // end raised floor
        new Platform({ x: platformImg.width * 12 + 3200 + platformOffset, y: 330, image: jumpPlatformImg }),  // jump platform   
        new Platform({ x: platformImg.width * 11 + 2900 + platformOffset, y: 230, image: jumpPlatformImg }),  // middle
        new Platform({ x: platformImg.width * 11 + 2800 + platformOffset, y: 320, image: jumpPlatformImg }),  // top   

        // Floor Platforms //
        new Platform({ x: -1, y: 410, image: platformImg }),
        new Platform({ x: platformImg.width - 3, y: 410, image: platformImg }),
        new Platform({ x: platformImg.width * 2 + 150, y: 410, image: platformImg }),
        new Platform({ x: platformImg.width * 3 + 350, y: 410, image: platformImg }),
        new Platform({ x: platformImg.width * 4 + 600 - 3, y: 410, image: platformImg }),
        new Platform({ x: platformImg.width * 5 + 595, y: 410, image: platformImg }),
        new Platform({ x: platformImg.width * 6 + 593, y: 410, image: platformImg }),
        new Platform({ x: platformImg.width * 7 + 1000, y: 410, image: platformImg }),
        new Platform({ x: platformImg.width * 8 + 995, y: 410, image: platformImg }),
        new Platform({ x: platformImg.width * 9 + 1500, y: 410, image: platformImg }),
        new Platform({ x: platformImg.width * 10 + 2000, y: 410, image: platformImg }),
        new Platform({ x: platformImg.width * 11 + 2800, y: 410, image: platformImg }),
        new Platform({ x: platformImg.width * 12 + 2795, y: 410, image: platformImg }),
        new Platform({ x: platformImg.width * 13 + 2793, y: 410, image: platformImg }),
        new Platform({ x: platformImg.width * 14 + 2791, y: 410, image: platformImg }),
        new Platform({ x: platformImg.width * 15 + 4000, y: 410, image: platformImg }),
        new Platform({ x: platformImg.width * 16 + 3995, y: 410, image: platformImg }),
        new Platform({ x: platformImg.width * 17 + 3992, y: 410, image: platformImg }),
        new Platform({ x: platformImg.width * 18 + 3989, y: 410, image: platformImg }),
        new Platform({ x: platformImg.width * 19 + 3986, y: 410, image: platformImg }),

        // TODO Death Cave //
        new Platform({ x: platformImg.width * 15 + 2413 + platformOffset, y: 300, image: jumpPlatformImg }),  // back (extends down)
        new Platform({ x: platformImg.width * 15 + 2413 + platformOffset, y: 290, image: jumpPlatformImg }),  // back (extends down)
        new Platform({ x: platformImg.width * 15 + 2412 + platformOffset, y: 140, image: jumpPlatformImg }),  // steps down raised floor 
        new Platform({ x: platformImg.width * 15 + 2601 + platformOffset, y: 320, image: jumpPlatformImg }),  // back (extends down)
        new Platform({ x: platformImg.width * 15 + 2600 + platformOffset, y: 230, image: jumpPlatformImg }),
        new Platform({ x: platformImg.width * 15 + 2800 + platformOffset, y: 320, image: jumpPlatformImg }),
        new Platform({ x: platformImg.width * 15 + 2797 + jumpPlatformImg.width + platformOffset, y: 320, image: jumpPlatformImg }),
    ]
    scenes = [
        new Scene({
            x: -1,
            y: -1,
            image: createImage('./img/background.png')
        }),
        new Scene({
            x: -1,
            y: -1,
            image: createImage('./img/hills.png')
        })
    ]

    scrollOffset = 0
}

function animate() {
    requestAnimationFrame(animate)                // recursively call
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)  // clear canvas, to maintain players shape

    // Stack images in order to be seen
    scenes.forEach(scene => {                     // 1st draw background
        scene.draw()
    })
    platforms.forEach(platform => {               // 2nd draw platforms, over background
        platform.draw()
    })
    player.update()                               // 3rd draw player, over everything else

    // left/right key press logic
    let atEdgeOfMap = keys.left.pressed && scrollOffset === 0 && player.position.x > 0
    if (keys.right.pressed
        && player.position.x < 400) {
        player.velocity.x = player.speed
    } else if (
        (keys.left.pressed && player.position.x > 100)
        || atEdgeOfMap
    ) {
        player.velocity.x = -player.speed
    } else {
        player.velocity.x = 0

        // Shift environment as player moves
        if (keys.right.pressed) {
            scrollOffset += player.speed
            platforms.forEach(platform => {
                platform.position.x -= player.speed
            })
            scenes.forEach(scene => {
                scene.position.x -= player.speed * .66   //* Note: scaling gives a paralax effect
            })
        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed
            platforms.forEach(platform => {
                platform.position.x += player.speed
            })
            scenes.forEach(scene => {
                scene.position.x += player.speed * .66   //* Note: scaling gives a paralax effect
            })
        }
    }

    // platform collision detection
    platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y
            && player.position.y + player.height + player.velocity.y >= platform.position.y
            && player.position.x + player.width >= platform.position.x
            && player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0
        }
    })

    // Sprite animation conditional
    if (
        keys.right.pressed &&
        lastKey === 'right' &&
        player.currentSprite !== player.sprites.run.right
    ) {
        player.frames = 1
        player.currentSprite = player.sprites.run.right
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    } else if (
        keys.left.pressed &&
        lastKey === 'left' &&
        player.currentSprite !== player.sprites.run.left
    ) {
        player.frames = 1
        player.currentSprite = player.sprites.run.left
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    } else if (
        !keys.left.pressed &&
        lastKey === 'left' &&
        player.currentSprite !== player.sprites.stand.left
    ) {
        player.frames = 1
        player.currentSprite = player.sprites.stand.left
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    } else if (
        !keys.right.pressed &&
        lastKey === 'right' &&
        player.currentSprite !== player.sprites.stand.right
    ) {
        player.frames = 1
        player.currentSprite = player.sprites.stand.right
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    }

    let levelDistance = platformImg.width * 5 + 500 - 3  // x distance from last platform

    // win condition 
    if (scrollOffset > levelDistance) {
        console.log('You Win!')
    }

    // lose condition
    if (player.position.y > canvas.height) {
        init()
    }
}

init()
animate()

// listener when key pressed 
addEventListener('keydown', ({ code: key }) => {
    switch (key) {
        case 'ArrowUp':
            player.velocity.y -= 20
            break
        case 'ArrowDown':
            break
        case 'ArrowLeft':
            keys.left.pressed = true
            lastKey = 'left'
            break
        case 'ArrowRight':
            keys.right.pressed = true
            lastKey = 'right'
            break
    }
})

// listener when key not pressed
addEventListener('keyup', ({ code: key }) => {
    switch (key) {
        case 'ArrowUp':
            break
        case 'ArrowDown':
            break
        case 'ArrowLeft':
            keys.left.pressed = false
            break
        case 'ArrowRight':
            keys.right.pressed = false
            break
    }
})