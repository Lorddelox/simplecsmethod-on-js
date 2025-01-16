let params = document.querySelector(".calc__params");
let restrictions = document.querySelector(".calc__restrictions"),
    vars = [],
    vector = [];

const func_container = document.querySelector(".object-function");
const restrictionsContainer = document.querySelector(".restrictions");
const solveBtn = document.querySelector(".solve");
const clearBtn = document.querySelector(".clear");

// Функция создания целевой функции
function objectFunction(numParams) {
    func_container.innerHTML = "";
    for (let i = 0; i < numParams; i++) {
        let input = document.createElement("input");
        input.classList.add(`var-${i}`);
        input.type = "number";

        const span = document.createElement("span");
        span.textContent = i === numParams - 1 ? `x${i + 1} → ` : `x${i + 1} + `;

        func_container.appendChild(input);
        func_container.appendChild(span);
    }

    // Добавляем селектор max/min
    const select = document.createElement("select");
    select.innerHTML = `
        <option value="max">max</option>
        <option value="min">min</option>
    `;
    select.classList.add("mode");
    func_container.appendChild(select);
}

// Функция создания ограничений
function restrictionsFunc(numParams, numRestrictions) {
    restrictionsContainer.innerHTML = "";
    for (let i = 0; i < numRestrictions; i++) {
        let div = document.createElement("div");
        div.classList.add(`rest-${i}-box`);
        restrictionsContainer.appendChild(div);

        for (let j = 0; j < numParams; j++) {
            let input = document.createElement("input");
            input.classList.add(`rest-${i}-${j}`);
            input.type = "number";

            const span = document.createElement("span");
            span.textContent = j === numParams - 1 ? `x${j + 1} ` : `x${j + 1} + `;

            div.appendChild(input);
            div.appendChild(span);
        }

        const select = document.createElement("select");
        select.classList.add(`rest-mode-${i}`);
        select.innerHTML = `
            <option value="≤">≤</option>
            <option value="=">=</option>
            <option value="≥">≥</option>
        `;
        div.appendChild(select);

        const outputValue = document.createElement("input");
        outputValue.classList.add(`rest-value-${i}`);
        outputValue.type = "number";
        div.appendChild(outputValue);
    }
}

// Проверка на корректный ввод чисел
function validateInputs() {
    let isValid = true;
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
        const value = input.value.trim();
        if (isNaN(value) || value === "") {
            isValid = false;
            input.classList.add("error");
        } else {
            input.classList.remove("error");
        }
    });
    if (!isValid) {
        alert("Некорректный ввод! Все поля должны содержать числа.");
    }
    return isValid;
}

// Очистка всех полей ввода
function clearInputs() {
    document.querySelectorAll("input").forEach((input) => {
        input.value = "";
        input.classList.remove("error");
    });
    vector = [];
    vars = [];
    func_container.innerHTML = "";
    restrictionsContainer.innerHTML = "";
    objectFunction(3);
    restrictionsFunc(3, 3);
}

// Обработчики событий
params.addEventListener("input", () => {
    const numParams = parseInt(params.value) || 0;
    objectFunction(numParams);
    restrictionsFunc(numParams, parseInt(restrictions.value) || 0);
});

restrictions.addEventListener("input", () => {
    const numRestrictions = parseInt(restrictions.value) || 0;
    restrictionsFunc(parseInt(params.value) || 0, numRestrictions);
});

function simplexMethod(tab, containerId) {
    const container = document.querySelector(containerId);

    // Функция для отображения таблицы
    function displayTable(step, description, table) {
        const stepDiv = document.createElement("div");
        stepDiv.classList.add("step");

        // Описание шага
        const stepTitle = document.createElement("h3");
        stepTitle.textContent = `Шаг ${step}: ${description}`;
        stepDiv.appendChild(stepTitle);

        // Создание таблицы
        const tableElement = document.createElement("table");
        tableElement.classList.add("simplex-table");

        table.forEach((row) => {
            const tr = document.createElement("tr");
            row.forEach((cell) => {
                const td = document.createElement("td");
                td.textContent = cell.toFixed(2); // Округление для удобства
                tr.appendChild(td);
            });
            tableElement.appendChild(tr);
        });

        stepDiv.appendChild(tableElement);
        container.appendChild(stepDiv);
    }

    // Проверка на оптимальность
    function isOptimal(lastRow) {
        return lastRow.every((val) => val >= 0);
    }

    // Нахождение разрешающего столбца
    function findPivotColumn(lastRow) {
        let minVal = Math.min(...lastRow);
        return lastRow.indexOf(minVal);
    }

    // Нахождение разрешающей строки
    function findPivotRow(tab, pivotCol) {
        let ratios = tab
            .slice(0, -1)
            .map((row) => {
                let b = row[row.length - 1];
                let a = row[pivotCol];
                return a > 0 ? b / a : Infinity;
            });

        return ratios.indexOf(Math.min(...ratios));
    }

    // Обновление таблицы
    function updateTable(tab, pivotRow, pivotCol) {
        let pivotElement = tab[pivotRow][pivotCol];

        // Делим разрешающую строку на разрешающий элемент
        tab[pivotRow] = tab[pivotRow].map((val) => val / pivotElement);

        // Обновляем остальные строки
        for (let i = 0; i < tab.length; i++) {
            if (i !== pivotRow) {
                let rowFactor = tab[i][pivotCol];
                tab[i] = tab[i].map((val, j) => val - rowFactor * tab[pivotRow][j]);
            }
        }
        console.log("Текущая таблица:", tab);
    }

    // Основной цикл
    let step = 0;
    console.log(!isOptimal(tab[tab.length - 1]));
    while (!isOptimal(tab[tab.length - 1])) {
        step++;
        let pivotCol = findPivotColumn(tab[tab.length - 1]);
        let pivotRow = findPivotRow(tab, pivotCol);

        if (pivotRow === -1) {
            displayTable(
                step,
                "Задача не имеет ограничений, решение невозможно.",
                tab
            );
            return null;
        }

        displayTable(
            step,
            `Выбрали разрешающий столбец ${pivotCol} и строку ${pivotRow}`,
            tab
        );

        updateTable(tab, pivotRow, pivotCol);

        displayTable(
            step,
            `Обновили таблицу с учетом разрешающего элемента (${pivotRow}, ${pivotCol})`,
            tab
        );
    }

    displayTable(step + 1, "Решение достигнуто! Итоговая таблица:", tab);
    function extractSolution(tab) {
        const numVariables = tab[0].length - 1; // Количество переменных (столбцы без свободного члена)
        const solution = Array(numVariables).fill(0); // Массив для хранения значений переменных

        // Пройдем по всем столбцам, чтобы найти базисные переменные
        for (let col = 0; col < numVariables; col++) {
            let isBasic = true;
            let basicRow = -1;

            // Проверяем, является ли столбец базисным
            for (let row = 0; row < tab.length - 1; row++) {
                if (tab[row][col] === 1 && basicRow === -1) {
                    basicRow = row; // Строка базиса
                } else if (tab[row][col] !== 0) {
                    isBasic = false; // Если встречаем значение, отличное от 0 или 1
                    break;
                }
            }

            // Если столбец базисный, берем значение свободного члена
            if (isBasic && basicRow !== -1) {
                solution[col] = tab[basicRow][tab[basicRow].length - 1];
            }
        }

        return solution;
    }
    return extractSolution(tab);
}

solveBtn.addEventListener("click", () => {
    if (!validateInputs()) return;

    const numParams = parseInt(params.value);
    const numRestrictions = parseInt(restrictions.value);
    vars = [];
    vector = [];

    // Сбор данных целевой функции
    for (let i = 0; i < numParams; i++) {
        vars.push(parseFloat(document.querySelector(`.var-${i}`).value));
    }
    vars = [...vars, ...Array(numRestrictions).fill(0)];

    // Сбор данных ограничений
    const rest = [];
    for (let i = 0; i < numRestrictions; i++) {
        const row = [];
        for (let j = 0; j < numParams; j++) {
            row.push(parseFloat(document.querySelector(`.rest-${i}-${j}`).value));
        }
        row.push(...Array(numRestrictions).fill(0));
        row[numParams + i] = 1;
        vector.push(parseFloat(document.querySelector(`.rest-value-${i}`).value));
        rest.push(row);
    }

    // Создаем симплекс-таблицу
    const tab = rest.map((row, i) => [...row, vector[i]]);
    tab.push([...vars, 0]);

    document.querySelectorAll(".step").forEach((el) => el.remove());
    const exampleTab = [
        [2, 1, 1, 0, 14], // Ограничение 1
        [4, 3, 0, 1, 28], // Ограничение 2
        [-3, -5, 0, 0, 0], // Целевая функция
    ];
    simplexMethod(tab, ".calc__container");
});

clearBtn.addEventListener("click", clearInputs);
objectFunction(3);
restrictionsFunc(3, 3);