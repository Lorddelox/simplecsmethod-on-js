let params = document.querySelector(".calc__params");
let restrictions = document.querySelector(".calc__restrictions");
const func_container = document.querySelector(".object-function");
const restrictionsContainer = document.querySelector(".restrictions")
function objectFunction(params) {
    for (let i = 0; i < params; i++) {
        let input = document.createElement("input");
        const span = document.createElement("span");
        input.classList.add(`var-${i}`)
        span.textContent = `x${i + 1} +`;
        func_container.appendChild(input);
        if (i == params - 1) {
            span.textContent = `x${i + 1} →`
            func_container.appendChild(span);
        }
        else {
            func_container.appendChild(span);
        }
    }
}
function restrictionsFunc(params, row) {
    for (let i = 0; i < row; i++) {
        let div = document.createElement("div");
        div.classList.add(`rest-${i}-box`);
        restrictionsContainer.appendChild(div);
        for (let j = 0; j < params; j++) {
            let input = document.createElement("input");
            const span = document.createElement("span");
            const select = document.createElement("select");
            const outputValue = document.createElement("input");
            input.classList.add(`rest-${i}-${j}`);
            outputValue.classList.add(`rest-value-${i}`);
            span.textContent = `x${j + 1} +`;
            div.appendChild(input);
            if (j == params - 1) {
                span.textContent = `x${j + 1}`
                div.appendChild(span);
                div.appendChild(select);
                div.appendChild(outputValue);
            }
            else {
                div.appendChild(span);
            }
            select.innerHTML = `
                    <option value="≤">
                    ≤
                </option>
                <option value="=">
                    =
                </option>
                <option value="≥">
                    ≥
                </option>
            `;
        }
    }
}
params.addEventListener("input", (e) => {
    [...func_container.children].forEach((item) => {
        if (item.tagName != "SELECT") {
            item.remove();
        }
    });
    [...restrictionsContainer.children].forEach((item) => {
        item.remove();
    });
    objectFunction(e.target.value);
    func_container.appendChild(select);
    restrictionsFunc(e.target.value, document.querySelector(".calc__restrictions").value)
});
restrictions.addEventListener("input", (e) => {
    [...restrictionsContainer.children].forEach((item) => {
        item.remove();
    });
    const params = document.querySelector(".calc__params").value;
    restrictionsFunc(params, e.target.value)
});

objectFunction(3);
const select = document.createElement("select");
select.innerHTML = `
         <option value="max">
        max
    </option>
    <option value="min">
        min
    </option>
`;
select.classList.add("mode");
func_container.appendChild(select);
restrictionsFunc(3, 3)

