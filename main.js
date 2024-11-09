const mainForm = document.forms[0];

const linesBuffer = mainForm.querySelector(".eq-container .lines-container");
let matrixCells = mainForm.querySelectorAll("input[id]:not([id='vars'])");

const solveBtn = mainForm.querySelector("#button");

const solutionBox = mainForm.querySelector(".result-container");
const solutionPhrase = mainForm.querySelector(".result-container .solution");

const linesNumber = mainForm.querySelector(".number-sec #vars");
let rowsCounter = +linesNumber.value;
let squaredMatrix = [];

window.onload = () => matrixCells[0].select();

for (let i = 0; i < rowsCounter; i++) addLine();

for (let i = 1; i < matrixCells.length; i++) {
    matrixCells[i - 1].addEventListener("keydown", enter => {
        if (enter.keyCode === 13) {
            enter.preventDefault();
            matrixCells[i].focus();
            matrixCells[i].select();

        }
        
        solutionBox.style.animation = "";
        solutionBox.style.height = "0";
    })
}

mainForm.addEventListener("submit", _ => _.preventDefault());


function addLine() {
    let n = linesBuffer.childElementCount + 1;
    for (let i = 1; i < n; i++) {
        linesBuffer.children[i - 1].children[n - 2].outerHTML += 
        `
        <div class="var-card">
            <input required type="number" id="var${n}-${i}" />
            <label for="var${n}-${i}"><var>x<sub>${n}</sub></var></label>
        </div>
        `
    }

    let cellDivs = "";
    for (let i = 1; i <= n; i++) {
        cellDivs += 
        `
        <div class="var-card">
            <input required type="number" id="var${i}-${n}" />
            <label for="var${i}-${n}"><var>x<sub>${i}</sub></var></label>
        </div>
        `
    }
    linesBuffer.innerHTML += 
    `
    <fieldset class="line">
        ${cellDivs}
        <div class="eq-result">
            <input required type="number" id="res${n}">
        </div>
    </fieldset>
    `

    matrixCells = mainForm.querySelectorAll("input[id]:not([id='vars'])");
    matrixCells.forEach(_=> _.value = 1);
}

function decreaseVars() {
    if (rowsCounter > 2) {
        linesBuffer.children[rowsCounter - 1].outerHTML = "";
        for (let i = 0; i < rowsCounter - 1; i++) {
            linesBuffer.children[i].children[rowsCounter - 1].outerHTML = "";
        }
        rowsCounter--
        linesNumber.value--
    }
}

function increaseVars() {
    addLine();
    rowsCounter++
    linesNumber.value++
}

function updateVarsNumber() {
    const currentNum = linesBuffer.childElementCount;
    const newNum = +linesNumber.value;
    if (newNum > currentNum) for (let i = 0; i < newNum - currentNum; i++) increaseVars();
    else if (newNum < currentNum) for (let i = 0; i < currentNum - newNum; i++) decreaseVars();
    linesNumber.value = newNum;
}

function calculateMatrix() {
    for (let i = 0; i < rowsCounter; i++) {
        squaredMatrix[i] = [];
        for (let j = 0; j < rowsCounter + 1; j++) {
            squaredMatrix[i][j] = +matrixCells[i * (rowsCounter + 1) + j].value;
        }
    }
    RowEchelonForm.solve();

    solutionBox.style.animation = "drop-solution .5s ease-out forwards";
    solutionBox.style.height = "fit-content";
}

class RowEchelonForm {
    static solve() {
        let matrix = squaredMatrix.map(_=>_.slice());
        
        const rows = matrix.length;
        const cols = matrix[0].length;

        // عملية تحويل المصفوفة إلى الصورة المتدرجة المبسطة
        for (let i = 0; i < rows; i++) {
            let leadingOne = i;

            // نبحث عن الصف اللي فيه القيمة الأكبر في العمود الحالي
            for (let j = i + 1; j < rows; j++) {
                if (Math.abs(matrix[j][i]) > Math.abs(matrix[leadingOne][i])) {
                    leadingOne = j;
                }
            }

            // نكمل إذا مفيش قيمة غير صفرية في العمود ده
            if (matrix[leadingOne][i] === 0) continue;

            // تبديل الصف الحالي بالصف اللي فيه القيمة الأكبر
            this.swapRows(matrix, i, leadingOne);

            // تحويل العنصر الأول في الصف إلى 1 عن طريق قسمته على نفسه
            const leadingOneValue = matrix[i][i];
            for (let j = i; j < cols; j++) {
                matrix[i][j] /= leadingOneValue;
            }

            // جعل جميع العناصر فوق وتحت العنصر الرئيسي تساوي 0
            for (let j = 0; j < rows; j++) {
                if (j !== i) {
                    const factor = matrix[j][i];
                    for (let k = i; k < cols; k++) {
                        matrix[j][k] -= factor * matrix[i][k];
                    }
                }
            }
        }

      // التحقق من وجود حل وحيد
        if (this.isConsistentAndUnique(matrix)) {
            this.printSolution(matrix);
        } else {
            solutionPhrase.innerHTML = "Infinite number of solutions";
        }
    }

    // دالة لتبديل صفين في المصفوفة
    static swapRows(matrix, row1, row2) {
        const temp = matrix[row1];
        matrix[row1] = matrix[row2];
        matrix[row2] = temp;
    }

    // دالة للتحقق من إذا كان النظام يحتوي على حل فريد
    static isConsistentAndUnique(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;

        for (let i = 0; i < rows; i++) {
            let allZeroes = true;
            for (let j = 0; j < cols - 1; j++) {
                if (matrix[i][j] !== 0) {
                    allZeroes = false;
                    break;
                }
            }
            if (allZeroes && matrix[i][cols - 1] !== 0) {
                return false; // إذا كان هناك صف كله أصفار مع وجود قيمة حرة، يبقى مفيش حلول
            }
        }
        return true;
    }

    // دالة لطباعة الحلول
    static printSolution(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        let solutionArr = [];
        for (let i = 0; i < rows; i++) {
            solutionArr[i] = `<var>x<sub>${i + 1}</sub></var> = ${matrix[i][cols - 1]}`;
        }
        solutionPhrase.innerHTML = solutionArr.join(", ");
    }
}