const utils = {
    generateRandomNumber: (max: number, min: number = 1) => Math.floor(min + Math.floor(Math.random() * (max - min)))
}

export default utils