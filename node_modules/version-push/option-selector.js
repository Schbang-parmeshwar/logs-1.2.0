import readline from 'readline'
const input = process.stdin
const output = process.stdout

const optionsSeletor = {}

optionsSeletor.selectedIndex = 0
optionsSeletor.options = ['patch', 'minor', 'major']
optionsSeletor.selector = '*'
optionsSeletor.isFirstTimeShowMenu = true

const keyPressedHandler = (_, key) => {
    if (key) {
        const optionLength = optionsSeletor.options.length - 1 
        if ( key.name === 'down' && optionsSeletor.selectedIndex < optionLength) {
            optionsSeletor.selectedIndex += 1
            optionsSeletor.createOptionMenu()
        }
        else if (key.name === 'up' && optionsSeletor.selectedIndex > 0 ) {
            optionsSeletor.selectedIndex -= 1
            optionsSeletor.createOptionMenu()
        }
        else if (key.name === 'escape' || (key.name === 'c' && key.ctrl) || key.name === 'return') {
            // console.log(optionsSeletor.options[optionsSeletor.selectedIndex])
            // save the answer 
            optionsSeletor.answer = optionsSeletor.options[optionsSeletor.selectedIndex]
            optionsSeletor.close()
        }
    }
}

const ansiEraseLines = (count) => {
    //adapted from sindresorhus ansi-escape module
    const ESC = '\u001B['
    const eraseLine = ESC + '2K';
    const cursorUp = (count = 1) => ESC + count + 'A'
    const cursorLeft = ESC + 'G'

    let clear = '';

	for (let i = 0; i < count; i++) {
		clear += eraseLine + (i < count - 1 ? cursorUp() : '');
	}

	if (count) {
		clear += cursorLeft;
	}

	return clear;

}

optionsSeletor.init = ()=> {
    const question = "Please select the version for sem-ver ?"
    console.log(question)

    readline.emitKeypressEvents(input)
    optionsSeletor.start()
}


optionsSeletor.start = () => {
    //setup the input for reading
    input.setRawMode(true)
    input.resume()
    input.on('keypress', keyPressedHandler)

    if (optionsSeletor.selectedIndex >= 0) {
        optionsSeletor.createOptionMenu()
    }
}

optionsSeletor.close = () => {
    input.setRawMode(false)
    input.pause()
    process.exit(0)
}

optionsSeletor.getPadding = (num = 10) => {
    let text = ' '
    for (let i = 0; i < num.length; i++) {
        text += ' '
    }
    return text
}

optionsSeletor.createOptionMenu = () => {
    const optionLength = optionsSeletor.options.length
    if (optionsSeletor.isFirstTimeShowMenu) {
        optionsSeletor.isFirstTimeShowMenu = false
    }
    else {
        output.write(ansiEraseLines(optionLength))

    }
    const padding = optionsSeletor.getPadding(20)
    const cursorColor = `\x1b[32m${optionsSeletor.selector}\x1b[0m`

    for (let i= 0; i < optionLength; i++) {
        
        const selectedOption = i === optionsSeletor.selectedIndex ? `${cursorColor} ${optionsSeletor.options[i]}` : optionsSeletor.options[i]
        const ending = i !== optionLength-1 ? '\n' : '' 
        output.write(padding + selectedOption + ending)
    }
}

export default optionsSeletor
