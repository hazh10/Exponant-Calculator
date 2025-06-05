const termsContainer =  document.getElementsByClassName("terms")[0];
const answerContainer =  document.getElementsByClassName("answer")[0];

termsContainer.style.display = "flex"
answerContainer.style.display = "flex"

let termsCounter = 0;
let last = 0;
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

let lastTerm = null;

let termElementsArray = []

function getTextWidth(text) {
    const metrics = context.measureText(text);
    return metrics.width;
}


function updateAnswer() {
    let cache = {}

    answerContainer.innerHTML = ""

    for (let i of termsContainer.childNodes) {
        answerContainer.appendChild(i.cloneNode(true))
    }

    let toBeRemoved = []
    let map = {}
    let beforeWasBracket = false
    let beforeWasDivision = false
    for (let i of answerContainer.childNodes) {
        if (i.textContent[0] == "(" || i.textContent[0] == ")") {
            toBeRemoved.push(i)
            if (i.textContent[0] == ")") {
                beforeWasBracket = true
            }
            continue
        }
        if (i.textContent[0] == "/") {
            beforeWasBracket = false
            toBeRemoved.push(i)
            beforeWasDivision = true;
            continue
        }
        if (cache[i.textContent[0]]) {
            if (beforeWasBracket) {
                map[i.textContent[0]] *= Number(i.querySelector("h6").textContent[0]);
                
            } else if (beforeWasDivision) {
                map[i.textContent[0]] -= Number(i.querySelector("h6").textContent[0]);
            } else {
                map[i.textContent[0]] += Number(i.querySelector("h6").textContent[0]);
            }
            cache[i.textContent[0]].querySelector("h6").textContent = map[i.textContent[0]]
            toBeRemoved.push(i)
        } else if (cache[i.textContent[0]] == null) {
            cache[i.textContent[0]] = i
            map[i.textContent[0]] = Number(i.querySelector("h6").textContent[0])
        }
        beforeWasBracket = false
        beforeWasDivision = false
    }

    for (let i of toBeRemoved) {
        i.remove()
    }

    answerContainer.style.position = "absolute"
    answerContainer.style.top = "200px"
}

document.addEventListener("keypress", (e) => {
    if (e.keyCode >= 97 && e.keyCode <= 122) {
        let h = document.createElement("h1")
        h.className = "term"
        h.textContent = e.key
        if (termsCounter > 0) {
            h.style.paddingLeft = "20px"
        }
        let size = getTextWidth(e.key)
        
        let h2 = document.createElement("h6")
        h2.textContent = "1"
        h2.style.position = "relative"
        h2.style.margin = "0px"
        h2.style.left = (size*2+7)+"px"
        h2.style.top = "-40px"
        h.appendChild(h2)
        
        termsContainer.appendChild(h)
        termsCounter++;

        lastTerm = h;

        termElementsArray.push(h)

        updateAnswer();
    } else if (e.keyCode >= 48 && e.keyCode <= 57) {
        lastTerm.querySelector("h6").textContent = e.key
        updateAnswer();
    }
});

document.onkeydown = (e) => {
    if (e.key == "Backspace") {
        if (termElementsArray.at(-1).textContent == ")") {
            let inst = termElementsArray.at(-1)
            termElementsArray.pop()
            inst.remove()

            let inst1 = termElementsArray.at(0)
            termElementsArray.splice(0, 1)
            inst1.remove()
            lastTerm = termElementsArray.at(-1)
        } else if (termElementsArray.at(-1).textContent == "/") {
            let inst = termElementsArray.at(-1)
            termElementsArray.pop()
            inst.remove()
            lastTerm = termElementsArray.at(-1)
        } else {
            
            termElementsArray.pop()
            lastTerm.remove()
            lastTerm = termElementsArray.at(-1)
            termsCounter--
            updateAnswer()
        }
        console.log(termElementsArray)
        console.log(lastTerm)
    }
    if (e.key == ")") {
        let h1 = document.createElement("h1")
        h1.className = "bracket"
        h1.textContent = "("
        termsContainer.prepend(h1)
        let h = document.createElement("h1")
        h.className = "bracket"
        h.textContent = ")"
        h.style.paddingLeft = "13px"
        termsContainer.appendChild(h)
        termElementsArray.unshift(h1)
        termElementsArray.push(h)
    }
    if (e.key == "/") {
        if (termElementsArray.at(-1).textContent[0] != ")") {
            let h1 = document.createElement("h1")
            h1.className = "bracket"
            h1.textContent = "("
            termsContainer.prepend(h1)
            let h = document.createElement("h1")
            h.className = "bracket"
            h.textContent = ")"
            h.style.paddingLeft = "13px"
            termsContainer.appendChild(h)
            termElementsArray.unshift(h1)
            termElementsArray.push(h)
        }
        let h1 = document.createElement("h1")
        h1.className = "division"
        h1.textContent = "/"
        termsContainer.appendChild(h1)
        termElementsArray.push(h1)
    }
}