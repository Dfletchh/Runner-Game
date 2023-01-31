
const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

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
        this.width = 200
        this.height = 20

        this.image = image
    }

    draw() {
        // c.fillStyle = 'black'
        c.drawImage(this.image, this.position.x, this.position.y)
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const image = new Image()
image.src = './img/platform.png'

const player = new Player()
const platforms = [
    new Platform({
        x: 200,
        y: 400,
        image
    }), new Platform({ x: 800, y: 600, image })
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
    requestAnimationFrame(animate)                  // recursively call
    c.clearRect(0, 0, canvas.width, canvas.height)  // clear canvas, to maintain players shape
    player.update()
    platforms.forEach(platform => {
        platform.draw()
    })

    // left/right key press logic
    if (keys.right.pressed
        && player.position.x < 400) {
        player.velocity.x = 5
    } else if (keys.left.pressed
        && player.position.x > 100) {
        player.velocity.x = -5
    } else {
        player.velocity.x = 0

        // shifts platforms as player moves
        if (keys.right.pressed) {
            scrollOffset += 5
            platforms.forEach(platform => {
                platform.position.x -= 5
            })
        } else if (keys.left.pressed) {
            scrollOffset -= 5
            platforms.forEach(platform => {
                platform.position.x += 5
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
            player.velocity.y -= 10
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