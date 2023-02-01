
const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')

// static play area 16 x 9 screen
canvas.width = 1024
canvas.height = 527

const gravity = 0.9

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 1
        }
        this.width = 30
        this.height = 30
    }

    draw() {
        c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // Fall until bottom of ground
        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity  // accelerating over time
        else this.velocity.y = 0
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
        // c.fillStyle = 'black'
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

const platformImg = createImage('./img/platform.png')

const player = new Player()
const platforms = [
    new Platform({
        x: -1,
        y: 410,
        image: platformImg
    }), new Platform({ x: platformImg.width - 3, y: 410, image: platformImg })
]
const scenes = [
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




const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

let scrollOffset = 0

function animate() {
    requestAnimationFrame(animate)                // recursively call
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)  // clear canvas, to maintain players shape

    // Stack images in order to be seen
    scenes.forEach(scene => {                   // 1st draw background
        scene.draw()
    })
    platforms.forEach(platform => {               // 2nd draw platforms, over background
        platform.draw()
    })
    player.update()                               // 3rd draw player, over everything else

    // left/right key press logic
    if (keys.right.pressed
        && player.position.x < 400) {
        player.velocity.x = 5
    } else if (keys.left.pressed
        && player.position.x > 100) {
        player.velocity.x = -5
    } else {
        player.velocity.x = 0

        // Shift environment as player moves
        if (keys.right.pressed) {
            scrollOffset += 5
            platforms.forEach(platform => {
                platform.position.x -= 5
            })
            scenes.forEach(scene => {
                scene.position.x -= 3   //* Note: using 3 in lieu of 5 gives a paralax effect
            })
        } else if (keys.left.pressed) {
            scrollOffset -= 5
            platforms.forEach(platform => {
                platform.position.x += 5
            })
            scenes.forEach(scene => {
                scene.position.x += 3   //* Note: using 3 in lieu of 5 gives a paralax effect
            })
        }
    }

    // platform collision
    platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y
            && player.position.y + player.height + player.velocity.y >= platform.position.y
            && player.position.x + player.width >= platform.position.x
            && player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0
        }
    })

    if (scrollOffset > 2000) {
        console.log('You Win!')
    }
}

animate()

// listener when key pressed 
addEventListener('keydown', ({ code: key }) => {
    switch (key) {
        case 'ArrowUp':
            player.velocity.y -= 7
            break
        case 'ArrowDown':
            break
        case 'ArrowLeft':
            keys.left.pressed = true
            break
        case 'ArrowRight':
            keys.right.pressed = true
            break
    }
})

// listener when key not pressed
addEventListener('keyup', ({ code: key }) => {
    switch (key) {
        case 'ArrowUp':
            player.velocity.y -= 10
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