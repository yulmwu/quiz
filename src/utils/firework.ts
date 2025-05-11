const createFirework = (x: number, y: number) => {
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div')
        particle.classList.add('particle')
        document.body.appendChild(particle)

        const angle = Math.random() * 2 * Math.PI
        const distance = Math.random() * 100 + 50
        const xOffset = Math.cos(angle) * distance + 'px'
        const yOffset = Math.sin(angle) * distance + 'px'

        particle.style.setProperty('--x', xOffset)
        particle.style.setProperty('--y', yOffset)
        particle.style.left = x + 'px'
        particle.style.top = y + 'px'
        particle.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`

        setTimeout(() => particle.remove(), 1300)
    }
}

export default createFirework
