const grid = document.querySelector('.grid')
const score = document.querySelector('.score')
const width = 15
const invadersRemoved = []
let currentGuardianIndex = 202
let invadersId
let isGoingRight = true
let direction = 1
let results = 0

for (let i = 0; i < width * width; i++) {
  const square = document.createElement('div')
  grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))
console.log(squares)

const invaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
  30, 31, 32, 33, 34, 35, 36, 37, 38, 39
]

function draw() {
  for (let i = 0; i < invaders.length; i++) {
    if (!invadersRemoved.includes(i)) {
      squares[invaders[i]].classList.add('invader')
    }
  }
}
draw()

squares[currentGuardianIndex].classList.add('guardian')

function remove() {
  for (let i = 0; i < invaders.length; i++) {
    squares[invaders[i]].classList.remove('invader')
  }
}

// move guardian 
function moveGuardian(e) {
  squares[currentGuardianIndex].classList.remove('guardian')
  switch(e.key) {
    case 'ArrowLeft':
      if (currentGuardianIndex % width !==0) currentGuardianIndex -= 1
      break
    case 'ArrowRight':
      if (currentGuardianIndex % width < width - 1) currentGuardianIndex += 1
      break
  }
  squares[currentGuardianIndex].classList.add('guardian')
}

document.addEventListener('keydown', moveGuardian)

function moveInvaders() {
  const leftEdge = invaders[0] % width === 0
  const rightEdge = invaders[invaders.length - 1] % width === width - 1
  remove()

  if (rightEdge && isGoingRight) {
    for (let i = 0; i < invaders.length; i++) {
      invaders[i] += width + 1
      direction = -1
      isGoingRight = false
    }
  }

  if (leftEdge && !isGoingRight) {
    for (let i = 0; i < invaders.length; i++) {
      invaders[i] += width - 1
      direction = 1
      isGoingRight = true
    }
  }

  for (let i = 0; i < invaders.length; i++) {
    invaders[i] += direction
  }

  draw()
  //  Win or Lose?
  if (squares[currentGuardianIndex].classList.contains('invader')) {
    score.innerHTML = 'Game Over! You got wasted.'
    clearInterval(invadersId)
  }

  if (invaders.some(invaderIndex => invaderIndex >= (squares.length - width))) {
    scoreElement.innerHTML = 'Game Over! Invaders reached Earth.';
    clearInterval(invadersId);
  }

  if (invadersRemoved.length === invaders.length) {
    score.innerHTML = 'You Win! All invaders defeated.'
    clearInterval(invadersId)
  }

}

invadersId = setInterval(moveInvaders, 300)

function shoot(e) {
  let laserId
  let currentLaserIndex = currentGuardianIndex

  function moveLaser() {
    squares[currentLaserIndex].classList.remove('laser')
    currentLaserIndex -= width
    squares[currentLaserIndex].classList.add('laser')

    if (squares[currentLaserIndex].classList.contains('invader')) {
      squares[currentLaserIndex].classList.remove('laser')
      squares[currentLaserIndex].classList.remove('invader')
      squares[currentLaserIndex].classList.add('boom')
      setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300)
      clearInterval(laserId)

      const invaderRemoved = invaders.indexOf(currentLaserIndex)
      invadersRemoved.push(invaderRemoved)
      results++
      score.innerHTML = results
      console.log(invadersRemoved)
    }
  }

  if (e.key === 'ArrowUp') {
    laserId = setInterval(moveLaser, 100)
  }

}

document.addEventListener('keydown', shoot)