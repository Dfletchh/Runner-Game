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

const player = new Player()
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

function animate() {
    requestAnimationFrame(animate)                  // recursively call
    c.clearRect(0, 0, canvas.width, canvas.height)  // clear canvas, to maintain players shape
    player.update()

    if (keys.right.pressed) {
        player.velocity.x = 5
    } else if (keys.left.pressed) {
        player.velocity.x = -5
    } else player.velocity.x = 0
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