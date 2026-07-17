let appData = null;
let currentQuiz = [];
let currentIndex = 0;
let score = 0;

// Hàm format số với dấu phẩy thay dấu chấm
function formatNumber(num) {
    if (num === undefined || num === null || isNaN(num)) return num;
    if (Number.isInteger(num) && Math.abs(num) < 1e12) {
        return num.toString();
    }
    let fixed = parseFloat(num.toFixed(3)).toString();
    return fixed.replace('.', ',');
}

// Hàm lấy ngẫu nhiên phần tử từ mảng
function randomPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomFromList(list) {
    return list[Math.floor(Math.random() * list.length)];
}

// Hàm tạo đáp án nhiễu
function generateDistractors(correctValue, unit, count = 3) {
    let distractors = [];
    let attempts = 0;
    while (distractors.length < count && attempts < 100) {
        let variant;
        let r = Math.random();
        if (r < 0.33) variant = correctValue * 2;
        else if (r < 0.66) variant = correctValue / 2;
        else variant = correctValue + (Math.random() * 0.5 - 0.25) * correctValue;
        variant = Math.round(variant * 100) / 100;
        if (variant !== correctValue && !distractors.some(d => Math.abs(parseFloat(d) - variant) < 0.0001)) {
            distractors.push(formatNumber(variant) + ' ' + unit);
        }
        attempts++;
    }
    return distractors;
}

const templateHandlers = {
    // Q01: đổi D kg/m3 -> g/cm3
    convertDensityToGperCm3: function() {
        const name = randomPick(Object.keys(appData.densities));
        const D = appData.densities[name];
        const correct = D / 1000;
        const text = `Hãy đổi khối lượng riêng của ${name} là ${formatNumber(D)} $\\text{kg/m}^3$ sang đơn vị $\\text{g/cm}^3$.`;
        const options = generateDistractors(correct, '$\\text{g/cm}^3$');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' $\\text{g/cm}^3$');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' $\\text{g/cm}^3$'),
            rationale: `Đổi từ $\\text{kg/m}^3$ sang $\\text{g/cm}^3$ ta chia cho 1000. ${formatNumber(D)} $\\text{kg/m}^3 = ${formatNumber(correct)} \\text{g/cm}^3$.`
        };
    },

    // Q02: đổi D/1000 g/cm3 -> kg/m3
    convertDensityToKgPerM3: function() {
        const name = randomPick(Object.keys(appData.densities));
        const D = appData.densities[name];
        const correct = D;
        const text = `Hãy đổi khối lượng riêng của ${name} là ${formatNumber(D/1000)} $\\text{g/cm}^3$ sang đơn vị $\\text{kg/m}^3$.`;
        const options = generateDistractors(correct, '$\\text{kg/m}^3$');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' $\\text{kg/m}^3$');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' $\\text{kg/m}^3$'),
            rationale: `Đổi từ $\\text{g/cm}^3$ sang $\\text{kg/m}^3$ ta nhân với 1000. ${formatNumber(D/1000)} $\\text{g/cm}^3 = ${formatNumber(D)} \\text{kg/m}^3$.`
        };
    },

    // Q03: D kg/m3 -> trọng lượng riêng D*10
    weightDensityFromDensity: function() {
        const name = randomPick(Object.keys(appData.densities));
        const D = appData.densities[name];
        const correct = D * 10;
        const text = `Khối lượng riêng của ${name} là ${formatNumber(D)} $\\text{kg/m}^3$. Vậy trọng lượng riêng của ${name} là bao nhiêu $\\text{N/m}^3$?`;
        const options = generateDistractors(correct, '$\\text{N/m}^3$');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' $\\text{N/m}^3$');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' $\\text{N/m}^3$'),
            rationale: `Trọng lượng riêng $d = 10D = 10 \\cdot ${formatNumber(D)} = ${formatNumber(correct)} \\text{N/m}^3$.`
        };
    },

    // Q04: d = D*10 N/m3 -> khối lượng riêng D
    densityFromWeightDensity: function() {
        const name = randomPick(Object.keys(appData.densities));
        const D = appData.densities[name];
        const correct = D;
        const text = `Trọng lượng riêng của ${name} là ${formatNumber(D*10)} $\\text{N/m}^3$. Vậy khối lượng riêng của ${name} là bao nhiêu $\\text{kg/m}^3$?`;
        const options = generateDistractors(correct, '$\\text{kg/m}^3$');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' $\\text{kg/m}^3$');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' $\\text{kg/m}^3$'),
            rationale: `Khối lượng riêng $D = \\dfrac{d}{10} = \\dfrac{${formatNumber(D*10)}}{10} = ${formatNumber(D)} \\text{kg/m}^3$.`
        };
    },

    // Q05: D/1000 g/cm3 -> trọng lượng riêng D*10
    weightDensityFromDensityGperCm3: function() {
        const name = randomPick(Object.keys(appData.densities));
        const D = appData.densities[name];
        const correct = D * 10;
        const text = `Khối lượng riêng của ${name} là ${formatNumber(D/1000)} $\\text{g/cm}^3$. Vậy trọng lượng riêng của ${name} là bao nhiêu $\\text{N/m}^3$?`;
        const options = generateDistractors(correct, '$\\text{N/m}^3$');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' $\\text{N/m}^3$');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' $\\text{N/m}^3$'),
            rationale: `Đổi ${formatNumber(D/1000)} $\\text{g/cm}^3 = ${formatNumber(D)} \\text{kg/m}^3$, $d = 10D = ${formatNumber(correct)} \\text{N/m}^3$.`
        };
    },

    // Q06: d = D*10 N/m3 -> D/1000 g/cm3
    densityGperCm3FromWeightDensity: function() {
        const name = randomPick(Object.keys(appData.densities));
        const D = appData.densities[name];
        const correct = D / 1000;
        const text = `Trọng lượng riêng của ${name} là ${formatNumber(D*10)} $\\text{N/m}^3$. Vậy khối lượng riêng của ${name} là bao nhiêu $\\text{g/cm}^3$?`;
        const options = generateDistractors(correct, '$\\text{g/cm}^3$');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' $\\text{g/cm}^3$');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' $\\text{g/cm}^3$'),
            rationale: `$d = 10D \\rightarrow D = \\dfrac{d}{10} = \\dfrac{${formatNumber(D*10)}}{10} = ${formatNumber(D)} \\text{kg/m}^3 = ${formatNumber(D/1000)} \\text{g/cm}^3$.`
        };
    },

    // Q09: Tính khối lượng từ V và D
    massFromVolume: function() {
        const name = randomPick(Object.keys(appData.densities));
        const D = appData.densities[name];
        const V = randomFromList([0.5, 1, 2, 5, 10]);
        const correct = D * V;
        const text = `Tính khối lượng của ${formatNumber(V)} $\\text{m}^3$ ${name}, biết ${name} có khối lượng riêng là ${formatNumber(D)} $\\text{kg/m}^3$.`;
        const options = generateDistractors(correct, 'kg');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' kg');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' kg'),
            rationale: `$m = DV = ${formatNumber(D)} \\cdot ${formatNumber(V)} = ${formatNumber(correct)} \\text{kg}$.`
        };
    },

    // Q10: Tính thể tích từ m và D
    volumeFromMass: function() {
        const name = randomPick(Object.keys(appData.densities));
        const D = appData.densities[name];
        const V = randomFromList([0.5, 1, 2, 5, 10]);
        const m = D * V;
        const correct = V;
        const text = `Tính thể tích của ${formatNumber(m)} kg ${name}, biết ${name} có khối lượng riêng là ${formatNumber(D)} $\\text{kg/m}^3$.`;
        const options = generateDistractors(correct, '$\\text{m}^3$');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' $\\text{m}^3$');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' $\\text{m}^3$'),
            rationale: `$V = \\dfrac{m}{D} = \\dfrac{${formatNumber(m)}}{${formatNumber(D)}} = ${formatNumber(V)} \\text{m}^3$.`
        };
    },

    // Q11: Tính khối lượng riêng từ m và V
    densityFromMassVolume: function() {
        const name = randomPick(Object.keys(appData.densities));
        const D = appData.densities[name];
        const V = randomFromList([0.5, 1, 2, 5, 10]);
        const m = D * V;
        const correct = D;
        const text = `Tính khối lượng riêng của ${name}, biết ${formatNumber(V)} $\\text{m}^3$ ${name} có khối lượng là ${formatNumber(m)} kg.`;
        const options = generateDistractors(correct, '$\\text{kg/m}^3$');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' $\\text{kg/m}^3$');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' $\\text{kg/m}^3$'),
            rationale: `$D = \\dfrac{m}{V} = \\dfrac{${formatNumber(m)}}{${formatNumber(V)}} = ${formatNumber(D)} \\text{kg/m}^3$.`
        };
    },

    // Q12: khối lượng từ thể tích lít
    massFromVolumeLiter: function() {
        const liquids = ['nước', 'xăng', 'dầu hỏa', 'dầu ăn', 'rượu'];
        const name = randomPick(liquids);
        const D = appData.densities[name];
        const V_lit = randomFromList([1, 2, 4]);
        const V_m3 = V_lit / 1000;
        const correct = D * V_m3;
        const text = `Khối lượng riêng của ${name} vào khoảng ${formatNumber(D)} $\\text{kg/m}^3$. Do đó ${formatNumber(V_lit)} lít ${name} sẽ có khối lượng khoảng bao nhiêu?`;
        const options = generateDistractors(correct, 'kg');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' kg');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' kg'),
            rationale: `Đổi ${formatNumber(V_lit)} lít = ${formatNumber(V_m3)} $\\text{m}^3$; $m = DV = ${formatNumber(D)} \\cdot ${formatNumber(V_m3)} = ${formatNumber(correct)} \\text{kg}$.`
        };
    },

    // Q13: khối lượng riêng từ hộp chữ nhật
    densityFromBox: function() {
        const name = randomPick(Object.keys(appData.densities));
        const D = appData.densities[name];
        const l1 = randomFromList([1,2,3,4,5]);
        const l2 = randomFromList([1,2,3,4,5]);
        const l3 = randomFromList([1,2,3,4,5]);
        const V = l1 * l2 * l3;
        const m = V * D / 1000;
        const correct = D;
        const text = `Một khối hộp chữ nhật có kích thước ${formatNumber(l1)} cm x ${formatNumber(l2)} cm x ${formatNumber(l3)} cm, có khối lượng ${formatNumber(m)} g. Tính khối lượng riêng của vật làm hộp.`;
        const options = generateDistractors(correct, '$\\text{kg/m}^3$');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' $\\text{kg/m}^3$');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' $\\text{kg/m}^3$'),
            rationale: `$V = ${formatNumber(l1)} \\cdot ${formatNumber(l2)} \\cdot ${formatNumber(l3)} = ${formatNumber(V)} \\text{cm}^3$; $D = \\dfrac{m}{V} = \\dfrac{${formatNumber(m)}}{${formatNumber(V)}} = ${formatNumber(correct)} \\text{kg/m}^3$.`
        };
    },

    // Q14: khối lượng đá hộp
    massFromStoneBox: function() {
        const l1 = randomFromList([0.5, 1, 2]);
        const l2 = randomFromList([0.5, 1, 2]);
        const l3 = randomFromList([0.5, 1, 2]);
        const V = l1 * l2 * l3;
        const D = 2580;
        const correct = D * V;
        const text = `Một khối đá hình hộp chữ nhật có kích thước ${formatNumber(l1)} m x ${formatNumber(l2)} m x ${formatNumber(l3)} m và khối lượng riêng là $2580\\ \\text{kg/m}^3$. Khối lượng của khối đá là bao nhiêu?`;
        const options = generateDistractors(correct, 'kg');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' kg');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' kg'),
            rationale: `$V = ${formatNumber(l1)} \\cdot ${formatNumber(l2)} \\cdot ${formatNumber(l3)} = ${formatNumber(V)} \\text{m}^3$; $m = DV = 2580 \\cdot ${formatNumber(V)} = ${formatNumber(correct)} \\text{kg}$.`
        };
    },

    // Q15: dầm kim loại
    massFromBeam: function() {
        const metals = ['chì', 'sắt', 'nhôm', 'đồng'];
        const name = randomPick(metals);
        const D = appData.densities[name];
        const V_dm3 = randomFromList([10, 20, 50, 60]);
        const V_m3 = V_dm3 / 1000;
        const correct = D * V_m3;
        const text = `Một cái dầm ${name} có thể tích là ${formatNumber(V_dm3)} $\\text{dm}^3$, biết khối lượng riêng của ${name} là ${formatNumber(D/1000)} $\\text{g/cm}^3$. Tính khối lượng của dầm ${name} này.`;
        const options = generateDistractors(correct, 'kg');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' kg');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' kg'),
            rationale: `Đổi ${formatNumber(V_dm3)} $\\text{dm}^3 = ${formatNumber(V_m3)} \\text{m}^3$; $D = ${formatNumber(D/1000)} \\text{g/cm}^3 = ${formatNumber(D)} \\text{kg/m}^3$; $m = DV = ${formatNumber(D)} \\cdot ${formatNumber(V_m3)} = ${formatNumber(correct)} \\text{kg}$.`
        };
    },

    // Q16: bể lỏng
    massFromTank: function() {
        const liquids = ['nước', 'xăng', 'dầu hỏa', 'dầu ăn', 'rượu'];
        const name = randomPick(liquids);
        const D = appData.densities[name];
        const l1 = randomFromList([10,20,30,40,50]);
        const l2 = randomFromList([10,20,30,40,50]);
        const l3 = randomFromList([10,20,30,40,50]);
        const V_cm3 = l1 * l2 * l3;
        const V_m3 = V_cm3 / 1e6;
        const correct = D * V_m3;
        const text = `Một bể ${name} có kích thước bên trong là ${formatNumber(l1)} cm x ${formatNumber(l2)} cm x ${formatNumber(l3)} cm. Cho biết khối lượng riêng của ${name} là ${formatNumber(D/1000)} $\\text{g/cm}^3$. Tính khối lượng ${name} trong bể chứa đầy ${name}.`;
        const options = generateDistractors(correct, 'kg');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' kg');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' kg'),
            rationale: `$V = ${formatNumber(l1)} \\cdot ${formatNumber(l2)} \\cdot ${formatNumber(l3)} = ${formatNumber(V_cm3)} \\text{cm}^3 = ${formatNumber(V_m3)} \\text{m}^3$; $m = DV = ${formatNumber(D)} \\cdot ${formatNumber(V_m3)} = ${formatNumber(correct)} \\text{kg}$.`
        };
    },

    // Q17: đồng xu
    volumeFromCoin: function() {
        const m = randomFromList([0.16, 0.18, 0.2]);
        const D = 5.6;
        const correct = m / D;
        const text = `Một đồng xu có khối lượng ${formatNumber(m)} g, được làm từ hợp kim có khối lượng riêng là $5,6\\ \\text{g/cm}^3$. Tính thể tích của đồng xu.`;
        const options = generateDistractors(correct, '$\\text{cm}^3$');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' $\\text{cm}^3$');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' $\\text{cm}^3$'),
            rationale: `$V = \\dfrac{m}{D} = \\dfrac{${formatNumber(m)}}{${formatNumber(D)}} = ${formatNumber(correct)} \\text{cm}^3$.`
        };
    },

    // Q18: chai chứa chất lỏng
    massFromBottle: function() {
        const liquids = ['nước', 'xăng', 'dầu hỏa', 'dầu ăn', 'rượu'];
        const name = randomPick(liquids);
        const D = appData.densities[name];
        const D_gcm3 = D / 1000;
        const V = 500;
        const correct = 100 + D_gcm3 * V;
        const text = `Một vỏ chai có khối lượng riêng 100 g, có thể chứa được 500 $\\text{cm}^3$ chất lỏng khi đầy. Chai chứa đầy ${name} có khối lượng riêng ${formatNumber(D)} $\\text{kg/m}^3$. Tính khối lượng của cả chai khi chứa đầy ${name}.`;
        const options = generateDistractors(correct, 'g');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' g');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' g'),
            rationale: `Đổi ${formatNumber(D)} $\\text{kg/m}^3 = ${formatNumber(D_gcm3)} \\text{g/cm}^3$; $m_{\\text{chất}} = DV = ${formatNumber(D_gcm3)} \\cdot 500 = ${formatNumber(D_gcm3*500)} \\text{g}$; $m_{\\text{cả chai}} = 100 + ${formatNumber(D_gcm3*500)} = ${formatNumber(correct)} \\text{g}$.`
        };
    },

    // Q19: số bao cát
    numberOfBags: function() {
        const m_tan = randomFromList([25, 50, 100]);
        const m_kg = m_tan * 1000;
        const D = 2500;
        const V = m_kg / D;
        const correct = Math.ceil(V / 0.5);
        const text = `Một người thợ xây cần ${formatNumber(m_tan)} tấn cát trộn vữa. Mỗi bao cát chứa $0,5\\ \\text{m}^3$ cát. Biết khối lượng riêng của cát là $2500\\ \\text{kg/m}^3$. Hỏi người này cần bao nhiêu bao cát như trên.`;
        const options = generateDistractors(correct, 'bao');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' bao');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' bao'),
            rationale: `Đổi ${formatNumber(m_tan)} tấn = ${formatNumber(m_kg)} kg; $V = \\dfrac{m}{D} = \\dfrac{${formatNumber(m_kg)}}{2500} = ${formatNumber(V)} \\text{m}^3$; số bao $= \\dfrac{V}{0,5} = ${formatNumber(V/0.5)} \\approx ${formatNumber(correct)}$ bao.`
        };
    },

    // Q21: tỉ lệ thể tích
    volumeRatio: function() {
        const metals = ['chì', 'sắt', 'nhôm', 'đồng'];
        const name1 = randomPick(metals);
        let name2 = randomPick(metals);
        while (name2 === name1) name2 = randomPick(metals);
        const D1 = appData.densities[name1];
        const D2 = appData.densities[name2];
        const correct = (2 * D2 / D1);
        const text = `Cho hai khối kim loại ${name1} và ${name2}. Khối ${name1} có khối lượng gấp đôi ${name2}. Biết khối lượng riêng của ${name1} và ${name2} lần lượt là $D_1 = ${formatNumber(D1)}\\ \\text{kg/m}^3$, $D_2 = ${formatNumber(D2)}\\ \\text{kg/m}^3$. Tỉ lệ thể tích giữa ${name1} và ${name2} bằng bao nhiêu?`;
        const options = generateDistractors(correct, '');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct));
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct)),
            rationale: `Ta có $m_1 = 2m_2 \\rightarrow D_1V_1 = 2D_2V_2 \\rightarrow \\dfrac{V_1}{V_2} = \\dfrac{2D_2}{D_1} = \\dfrac{2 \\cdot ${formatNumber(D2)}}{${formatNumber(D1)}} = ${formatNumber(correct)}$.`
        };
    },

    // Q22: thể tích chất lỏng
    volumeOfLiquid: function() {
        const metals = ['chì', 'sắt', 'nhôm', 'đồng'];
        const liquids = ['nước', 'xăng', 'dầu hỏa', 'dầu ăn', 'rượu'];
        const metal = randomPick(metals);
        const liquid = randomPick(liquids);
        const D1 = appData.densities[metal];
        const D2 = appData.densities[liquid];
        const V1 = 1e-3;
        const correct = V1 * D1 / D2;
        const text = `Đặt một khối ${metal} có thể tích $V_1 = 1\\ \\text{dm}^3$ trên đĩa trái của cân Robecvan. Hỏi phải dùng bao nhiêu lít ${liquid} (đựng trong bình chứa có khối lượng không đáng kể) đặt lên đĩa phải để cân nằm thăng bằng? Cho khối lượng riêng của ${metal} là ${formatNumber(D1)} $\\text{kg/m}^3$, của ${liquid} là ${formatNumber(D2)} $\\text{kg/m}^3$.`;
        const options = generateDistractors(correct, 'lít');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' lít');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' lít'),
            rationale: `Cân thăng bằng khi $m_{\\text{kl}} = m_{\\text{lỏng}} \\rightarrow D_1V_1 = D_2V_2 \\rightarrow V_2 = \\dfrac{V_1D_1}{D_2} = \\dfrac{0,001 \\cdot ${formatNumber(D1)}}{${formatNumber(D2)}} = ${formatNumber(correct)} \\text{m}^3 = ${formatNumber(correct*1000)} \\text{lít}$.`
        };
    },

    // Q23: trọng lượng đống cát
    weightOfSand: function() {
        const V0 = randomFromList([10, 20, 40]);
        const m0 = V0 * 1.5;
        const D = m0 / (V0 / 1000);
        const V1 = randomFromList([1, 2, 4]);
        const m1 = V1 * 1500;
        const correct = m1 * 10;
        const text = `Biết ${formatNumber(V0)} lít cát có khối lượng ${formatNumber(m0)} kg. Tính trọng lượng của một đống cát ${formatNumber(V1)} $\\text{m}^3$.`;
        const options = generateDistractors(correct, 'N');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' N');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' N'),
            rationale: `$D = \\dfrac{m_0}{V_0} = \\dfrac{${formatNumber(m0)}}{${formatNumber(V0/1000)}} = ${formatNumber(D)} \\text{kg/m}^3$; $m_1 = ${formatNumber(V1)} \\cdot 1500 = ${formatNumber(m1)} \\text{kg}$; $P = m_1 \\cdot 10 = ${formatNumber(correct)} \\text{N}$.`
        };
    },

    // Q24: khối lượng riêng hỗn hợp
    densityOfMixture: function() {
        const D1 = 1000;
        const V1 = 0.003;
        const V2 = 0.002;
        const V = V1 + V2;
        const D_ho = 900;
        const m = D_ho * V;
        const m1 = D1 * V1;
        const m2 = m - m1;
        const correct = m2 / V2;
        const text = `Lấy 2 lít một chất lỏng nào đó pha trộn với 3 lít nước được một hỗn hợp có khối lượng riêng là $900\\ \\text{kg/m}^3$. Biết khối lượng riêng của nước là $1000\\ \\text{kg/m}^3$. Tìm khối lượng riêng của chất lỏng đó.`;
        const options = generateDistractors(correct, '$\\text{kg/m}^3$');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' $\\text{kg/m}^3$');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' $\\text{kg/m}^3$'),
            rationale: `$V = 0,003+0,002 = 0,005 \\text{m}^3$; $m = 900 \\cdot 0,005 = 4,5 \\text{kg}$; $m_1 = 1000 \\cdot 0,003 = 3 \\text{kg}$; $m_2 = 1,5 \\text{kg}$; $D_2 = \\dfrac{m_2}{V_2} = \\dfrac{1,5}{0,002} = ${formatNumber(correct)} \\text{kg/m}^3$.`
        };
    },

    // Q25: khối lượng xe chở gỗ
    weightOfTruck: function() {
        const D = 700;
        const d = 0.8;
        const l = 10;
        const V = 3.14 * (d/2)*(d/2) * l;
        const m_gỗ = D * V;
        const m_xe = 15 + 3 * m_gỗ / 1000;
        const correct = m_xe;
        const text = `Một chiếc xe tải dùng để vận chuyển gỗ trong rừng có khối lượng là 15 tấn xe chở 3 khúc gỗ hình trụ đều, mỗi khúc dài 10m đường kính 0,8m. Tính khối lượng của xe khi chở gỗ. Biết rằng khối lượng riêng của gỗ là $700\\ \\text{kg/m}^3$.`;
        const options = generateDistractors(correct, 'tấn');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' tấn');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' tấn'),
            rationale: `$V = \\pi\\left(\\dfrac{0,8}{2}\\right)^2 \\cdot 10 = ${formatNumber(V)} \\text{m}^3$; $m_{\\text{gỗ}} = DV = ${formatNumber(D)} \\cdot ${formatNumber(V)} = ${formatNumber(m_gỗ)} \\text{kg} = ${formatNumber(m_gỗ/1000)} \\text{tấn}$; $m_{\\text{tổng}} = 15 + 3\\cdot${formatNumber(m_gỗ/1000)} = ${formatNumber(correct)} \\text{tấn}$.`
        };
    },

    // Q26: thể tích và khối lượng từ lực kế
    volumeAndMassFromForce: function() {
        const dn = 10000;
        const dd = 8000;
        const Fn = 9;
        const Fd = 10;
        const V = (Fd - Fn) / (dn - dd);
        const m = (Fn + dn * V) / 10;
        const correctV = V;
        const correctM = m;
        const text = `Một vật được treo vào lực kế, nếu nhúng vật chìm trong nước thì lực kế chỉ 9N, nhưng nếu nhúng chìm vật trong dầu thì lực kế chỉ 10N. Hãy tìm thể tích và khối lượng của nó. Biết trọng lượng riêng của nước và dầu lần lượt là $10000\\ \\text{N/m}^3$ và $8000\\ \\text{N/m}^3$.`;
        const vStr = formatNumber(correctV);
        const mStr = formatNumber(correctM);
        const options = [
            `$V = ${vStr}\\ \\text{m}^3, m = ${mStr}\\ \\text{kg}$`,
            `$V = ${formatNumber(correctV*2)}\\ \\text{m}^3, m = ${formatNumber(correctM*2)}\\ \\text{kg}$`,
            `$V = ${formatNumber(correctV/2)}\\ \\text{m}^3, m = ${formatNumber(correctM/2)}\\ \\text{kg}$`,
            `$V = ${formatNumber(correctV+0.0001)}\\ \\text{m}^3, m = ${formatNumber(correctM+0.1)}\\ \\text{kg}$`
        ];
        return {
            text,
            options,
            correct: 0,
            rationale: `$P = 9 + 10000V = 10 + 8000V \\rightarrow 2000V = 1 \\rightarrow V = 5\\cdot10^{-4}\\ \\text{m}^3$; $m = \\dfrac{9 + 10000\\cdot5\\cdot10^{-4}}{10} = 1,4\\ \\text{kg}$.`
        };
    },

    // Q27: thể tích, khối lượng, khối lượng riêng từ độ tăng khối lượng
    volumeMassDensityFromDisplacement: function() {
        const D1 = 1;
        const D2 = 0.9;
        const m1 = 21.75;
        const m2 = 51.75;
        const V = (m2 - m1) / (D1 - D2);
        const m = m1 + D1 * V;
        const D = m / V;
        const text = `Hãy tính thể tích $V$, khối lượng $m$, khối lượng riêng $D$ của một vật rắn biết rằng: khi thả nó vào một bình đầy nước thì khối lượng của cả bình tăng thêm là $m_1 = 21,75$ gam, còn khi thả nó vào một bình đầy dầu thì khối lượng của cả bình tăng thêm là $m_2 = 51,75$ gam (Trong cả hai trường hợp vật đều chìm hoàn toàn). Cho biết khối lượng riêng của nước là $D_1 = 1\\text{g/cm}^3$, của dầu là $D_2 = 0,9\\text{g/cm}^3$.`;
        const options = [
            `$V = 300\\ \\text{cm}^3, m = 321,75\\ \\text{g}, D = 1,07\\ \\text{g/cm}^3$`,
            `$V = 300\\ \\text{cm}^3, m = 321,75\\ \\text{g}, D = 1,07\\ \\text{g/cm}^3$`,
            `$V = 250\\ \\text{cm}^3, m = 300\\ \\text{g}, D = 1,2\\ \\text{g/cm}^3$`,
            `$V = 350\\ \\text{cm}^3, m = 350\\ \\text{g}, D = 1,0\\ \\text{g/cm}^3$`
        ];
        return {
            text,
            options,
            correct: 0,
            rationale: `$m_2 - m_1 = V(D_1 - D_2) \\rightarrow V = \\dfrac{51,75-21,75}{1-0,9} = 300\\ \\text{cm}^3$; $m = 21,75 + 1\\cdot300 = 321,75\\ \\text{g}$; $D = \\dfrac{321,75}{300} = 1,07\\ \\text{g/cm}^3$.`
        };
    },

    // Q28: khối lượng thiếc và chì
    massOfTinLead: function() {
        const D1 = 7.3;
        const D2 = 11.3;
        const m = 664;
        const D = 8.3;
        const V = m / D;
        const m1 = (m - D2 * V) / (1 - D2/D1);
        const m2 = m - m1;
        const text = `Một mẩu hợp kim thiếc - chì có khối lượng $m = 664\\text{g}$, khối lượng riêng $D = 8,3\\text{g/cm}^3$. Hãy xác định khối lượng của thiếc và chì trong hợp kim. Biết khối lượng riêng của thiếc là $D_1 = 7300\\text{kg/m}^3$, của chì là $D_2 = 11300\\text{kg/m}^3$ và coi rằng thể tích của hợp kim bằng tổng thể tích các kim loại thành phần.`;
        const options = [
            `$m_{\\text{thiếc}} = 438\\text{g}, m_{\\text{chì}} = 226\\text{g}$`,
            `$m_{\\text{thiếc}} = 226\\text{g}, m_{\\text{chì}} = 438\\text{g}$`,
            `$m_{\\text{thiếc}} = 500\\text{g}, m_{\\text{chì}} = 164\\text{g}$`,
            `$m_{\\text{thiếc}} = 164\\text{g}, m_{\\text{chì}} = 500\\text{g}$`
        ];
        return {
            text,
            options,
            correct: 0,
            rationale: `$D_1 = 7,3\\ \\text{g/cm}^3$, $D_2 = 11,3\\ \\text{g/cm}^3$; Giải hệ: $m_1 + m_2 = 664$; $\\dfrac{m_1}{7,3} + \\dfrac{m_2}{11,3} = \\dfrac{664}{8,3} \\rightarrow m_1 = 438\\text{g}, m_2 = 226\\text{g}$.`
        };
    },

    // Q44: áp suất từ F và S
    pressureFromForceArea: function() {
        const F = randomFromList([9, 27, 36]);
        const S = randomFromList([1, 3, 9]);
        const correct = F / S;
        const text = `Một áp lực ${formatNumber(F)} N tác dụng lên một diện tích ${formatNumber(S)} $\\text{m}^2$ gây ra áp suất là bao nhiêu?`;
        const options = generateDistractors(correct, '$\\text{N/m}^2$');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' $\\text{N/m}^2$');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' $\\text{N/m}^2$'),
            rationale: `$p = \\dfrac{F}{S} = \\dfrac{${formatNumber(F)}}{${formatNumber(S)}} = ${formatNumber(correct)}\\ \\text{N/m}^2$.`
        };
    },

    // Q45: diện tích từ F và p
    areaFromPressure: function() {
        const F = randomFromList([500, 1000, 2000]);
        const p = randomFromList([1000, 2000, 4000]);
        const S = F / p;
        const correct = S * 10000;
        const text = `Một áp lực ${formatNumber(F)} N gây ra áp suất ${formatNumber(p)} $\\text{N/m}^2$ lên diện tích bị ép. Diện tích mặt bị ép là bao nhiêu $\\text{cm}^2$?`;
        const options = generateDistractors(correct, '$\\text{cm}^2$');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' $\\text{cm}^2$');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' $\\text{cm}^2$'),
            rationale: `$S = \\dfrac{F}{p} = \\dfrac{${formatNumber(F)}}{${formatNumber(p)}} = ${formatNumber(S)}\\ \\text{m}^2 = ${formatNumber(correct)}\\ \\text{cm}^2$.`
        };
    },

    // Q46: áp suất từ F và S (gió)
    pressureFromForceArea2: function() {
        const F = randomFromList([8000, 8200, 8400]);
        const S = randomFromList([10, 20, 40]);
        const correct = F / S;
        const text = `Áp lực của gió tác dụng trung bình lên một cánh buồm là ${formatNumber(F)} N, diện tích của cánh buồm là ${formatNumber(S)} $\\text{m}^2$. Cánh buồm phải chịu áp suất bằng bao nhiêu?`;
        const options = generateDistractors(correct, '$\\text{N/m}^2$');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' $\\text{N/m}^2$');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' $\\text{N/m}^2$'),
            rationale: `$p = \\dfrac{F}{S} = \\dfrac{${formatNumber(F)}}{${formatNumber(S)}} = ${formatNumber(correct)}\\ \\text{N/m}^2$.`
        };
    },

    // Q53: trọng lượng từ áp suất và diện tích
    weightFromPressure: function() {
        const p = randomFromList([1.6, 1.7, 1.8]) * 10000;
        const S = 0.03;
        const correct = p * S;
        const m = correct / 10;
        const text = `Một người tác dụng lên mặt sàn một áp suất $p = ${formatNumber(p/10000)}\\cdot10^4\\ \\text{N/m}^2$. Diện tích của hai bàn chân tiếp xúc với mặt sàn là $0,03\\text{m}^2$. Hỏi trọng lượng và khối lượng của người đó?`;
        const options = [
            `$P = ${formatNumber(correct)}\\text{N}, m = ${formatNumber(m)}\\text{kg}$`,
            `$P = ${formatNumber(correct*2)}\\text{N}, m = ${formatNumber(m*2)}\\text{kg}$`,
            `$P = ${formatNumber(correct/2)}\\text{N}, m = ${formatNumber(m/2)}\\text{kg}$`,
            `$P = ${formatNumber(correct+10)}\\text{N}, m = ${formatNumber(m+1)}\\text{kg}$`
        ];
        return {
            text,
            options,
            correct: 0,
            rationale: `$P = F = pS = ${formatNumber(p)} \\cdot 0,03 = ${formatNumber(correct)}\\ \\text{N}$; $m = \\dfrac{P}{10} = ${formatNumber(m)}\\ \\text{kg}$.`
        };
    },

    // Q54: áp suất của thầy Giang
    pressureFromMassArea: function() {
        const m = randomFromList([57, 60, 63]);
        const S = 2 * 30 * 1e-4;
        const correct = (m * 10) / S;
        const text = `Biết thầy Giang có khối lượng ${formatNumber(m)} kg, diện tích một bàn chân là $30\\ \\text{cm}^2$. Tính áp suất thầy Giang tác dụng lên sàn khi đứng cả hai chân.`;
        const options = generateDistractors(correct, 'Pa');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' Pa');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' Pa'),
            rationale: `$F = 10\\cdot${formatNumber(m)} = ${formatNumber(m*10)}\\ \\text{N}$; $S = 2\\cdot30\\cdot10^{-4} = 0,006\\ \\text{m}^2$; $p = \\dfrac{${formatNumber(m*10)}}{0,006} = ${formatNumber(correct)}\\ \\text{Pa}$.`
        };
    },

    // Q55: diện tích bánh máy cày
    areaFromWeightPressure: function() {
        const m = 1000;
        const P = m * 10;
        const p = 10000;
        const S = P / p;
        const correct = S / 2;
        const text = `Một máy đánh ruộng có khối lượng 1 tấn, để máy chạy được trên nền đất ruộng thì áp suất máy tác dụng lên đất là $10000\\ \\text{Pa}$. Hỏi diện tích 1 bánh của máy đánh phải tiếp xúc với ruộng là?`;
        const options = generateDistractors(correct, '$\\text{m}^2$');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' $\\text{m}^2$');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' $\\text{m}^2$'),
            rationale: `$P = 10^3 \\cdot 10 = 10^4\\ \\text{N}$; $S = \\dfrac{P}{p} = \\dfrac{10000}{10000} = 1\\ \\text{m}^2$; diện tích 1 bánh $= \\dfrac{S}{2} = 0,5\\ \\text{m}^2$.`
        };
    },

    // Q56: tỉ lệ áp suất khối lập phương
    pressureCubeRatio: function() {
        const t = randomFromList([2, 3, 4]);
        const correct = t * t * t;
        const text = `Hai khối lập phương A và B làm bằng vật liệu giống nhau, khối B có cạnh lớn gấp ${formatNumber(t)} khối A. Đặt khối A lên mặt của khối B thì khối A tạo áp suất $p$ lên mặt của khối B. Nếu đặt khối B lên trên một mặt của khối A thì áp suất của khối B tác dụng lên trên bề mặt của khối A là bao nhiêu?`;
        const options = generateDistractors(correct, 'p');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + 'p');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + 'p'),
            rationale: `$p_A = D\\cdot a\\cdot 10$; $p_B = D\\cdot ${t^3}\\cdot a\\cdot 10 = ${t^3}p$.`
        };
    },

    // Q71: tàu ngầm
    submarineDepth: function() {
        const a = randomFromList([870000, 875000, 880000]);
        const p2 = a + 290000;
        const text = `Một tàu ngầm đang di chuyển dưới biển. Áp kế đặt ở ngoài vỏ tàu chỉ ${formatNumber(a)} $\\text{N/m}^2$, một lúc sau áp kế chỉ ${formatNumber(p2)} $\\text{N/m}^2$. Tàu đang chuyển động như thế nào?`;
        const options = ["Tàu đang lặn xuống", "Tàu đang chuyển động về phía trước theo phương ngang", "Tàu đang từ từ nổi lên", "Tàu đang chuyển động lùi về phía sau theo phương ngang"];
        return {
            text,
            options,
            correct: 0,
            rationale: `Áp suất tăng (${formatNumber(p2)} > ${formatNumber(a)}) nên tàu lặn xuống.`
        };
    },

    // Q73: chiều cao cột rượu
    heightOfAlcohol: function() {
        const hHg = randomFromList([68, 85, 102]) / 100;
        const dHg = 136000;
        const druou = 8000;
        const correct = hHg * dHg / druou;
        const text = `Trong thí nghiệm của Torixeli, độ cao cột thủy ngân là ${formatNumber(hHg*100)} cm, nếu dùng rượu để thay thủy ngân thì độ cao cột rượu là bao nhiêu? Biết $d_{\\text{Hg}} = 136000\\ \\text{N/m}^3$, $d_{\\text{rượu}} = 8000\\ \\text{N/m}^3$.`;
        const options = generateDistractors(correct, 'm');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' m');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' m'),
            rationale: `$d_{\\text{Hg}}h_{\\text{Hg}} = d_{\\text{rượu}}h_{\\text{rượu}} \\rightarrow h_{\\text{rượu}} = \\dfrac{${formatNumber(hHg)} \\cdot 136000}{8000} = ${formatNumber(correct)}\\ \\text{m}$.`
        };
    },

    // Q74: áp suất khí quyển ở độ cao
    atmosphericPressureAltitude: function() {
        const h = randomFromList([600, 720, 840]);
        const p0 = 760;
        const delta = h / 12;
        const correct = p0 - delta;
        const text = `Càng lên cao không khí càng loãng nên áp suất càng giảm. Cứ lên cao 12m thì áp suất khí quyển giảm khoảng 1mmHg. Áp suất khí quyển ở độ cao ${formatNumber(h)} m là bao nhiêu? Biết tại mặt đất áp suất khí quyển là 760mmHg.`;
        const options = generateDistractors(correct, 'mmHg');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' mmHg');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' mmHg'),
            rationale: `$\\Delta p = \\dfrac{${formatNumber(h)}}{12} = ${formatNumber(delta)}\\ \\text{mmHg}$; $p = 760 - ${formatNumber(delta)} = ${formatNumber(correct)}\\ \\text{mmHg}$.`
        };
    },

    // Q75: độ cao máy bay
    altitudeFromPressure: function() {
        const a = randomFromList([350, 400]);
        const p0 = 760;
        const delta = p0 - a;
        const correct = delta * 12;
        const text = `Cứ cao lên 12m áp suất khí quyển lại giảm khoảng 1mmHg. Trên một máy bay, cột thủy ngân trong ống Tô-ri-xe-li có độ cao ${formatNumber(a)} mm. Khi đó máy bay cách mặt đất bao nhiêu? Biết tại mặt đất áp suất khí quyển là 760 mmHg.`;
        const options = generateDistractors(correct, 'm');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' m');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' m'),
            rationale: `$\\Delta p = 760 - ${formatNumber(a)} = ${formatNumber(delta)}\\ \\text{mmHg}$; $h = ${formatNumber(delta)} \\cdot 12 = ${formatNumber(correct)}\\ \\text{m}$.`
        };
    },

    // Q76: độ cao núi
    mountainHeight: function() {
        const p1 = 752;
        const p2 = 708;
        const delta = p1 - p2;
        const correct = delta * 12;
        const text = `Khi đặt ống Torrixeli ở chân một quả núi, cột thủy ngân có độ cao 752mm. Khi đặt nó ở ngọn núi, cột thủy ngân cao 708mm. Tính độ cao của ngọn núi so với chân núi. Biết rằng cứ lên cao 12m thì áp suất khí quyển giảm 1mmHg và tại mặt đất áp suất khí quyển là 760mmHg.`;
        const options = generateDistractors(correct, 'm');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' m');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' m'),
            rationale: `$\\Delta p = ${formatNumber(p1)} - ${formatNumber(p2)} = ${formatNumber(delta)}\\ \\text{mmHg}$; $h = ${formatNumber(delta)} \\cdot 12 = ${formatNumber(correct)}\\ \\text{m}$.`
        };
    },

    // Q85: trọng lượng bè
    weightOfBoat: function() {
        const a = randomFromList([4,5,8]);
        const b = randomFromList([2,3]);
        const V = a * b * 0.5;
        const correct = 10000 * V;
        const text = `Một chiếc bè có dạng hình hộp dài ${formatNumber(a)} m, rộng ${formatNumber(b)} m. Biết bè ngập sâu trong nước 0,5 m; trọng lượng riêng của nước $10000\\ \\text{N/m}^3$. Chiếc bè có trọng lượng là bao nhiêu?`;
        const options = generateDistractors(correct, 'N');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' N');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' N'),
            rationale: `$V = ${formatNumber(a)} \\cdot ${formatNumber(b)} \\cdot 0,5 = ${formatNumber(V)}\\ \\text{m}^3$; $P = dV = 10000 \\cdot ${formatNumber(V)} = ${formatNumber(correct)}\\ \\text{N}$.`
        };
    },

    // Q94: lực đẩy Acsimet
    archimedesForce: function() {
        const a = randomFromList([1.2,1.3,1.4,1.5]);
        const b = randomFromList([0.7,0.8,0.9,1]);
        const correct = a - b;
        const text = `Một quả cầu bằng sắt treo vào 1 lực kế ở ngoài không khí lực kế chỉ ${formatNumber(a)} N. Nhúng chìm quả cầu vào nước thì lực kế chỉ ${formatNumber(b)} N. Lực đẩy Acsimet có độ lớn là?`;
        const options = generateDistractors(correct, 'N');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' N');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' N'),
            rationale: `$F_A = P - F = ${formatNumber(a)} - ${formatNumber(b)} = ${formatNumber(correct)}\\ \\text{N}$.`
        };
    },

    // Q95: thể tích từ lực đẩy
    volumeFromArchimedes: function() {
        const a = randomFromList([2.5,2.75,3]);
        const b = randomFromList([2,2.25]);
        const correct = (a - b) / 10000;
        const text = `Một vật móc vào 1 lực kế, ngoài không khí lực kế chỉ ${formatNumber(a)} N. Khi nhúng chìm vật vào trong nước lực kế chỉ ${formatNumber(b)} N. Biết trọng lượng riêng của nước là $10000\\ \\text{N/m}^3$. Thể tích của vật là:`;
        const options = generateDistractors(correct, '$\\text{cm}^3$');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct*1e6) + ' $\\text{cm}^3$');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct*1e6) + ' $\\text{cm}^3$'),
            rationale: `$F_A = ${formatNumber(a)} - ${formatNumber(b)} = ${formatNumber(a-b)}\\ \\text{N}$; $V = \\dfrac{F_A}{10000} = ${formatNumber(correct)}\\ \\text{m}^3 = ${formatNumber(correct*1e6)}\\ \\text{cm}^3$.`
        };
    },

    // Q96: lực đẩy với thể tích cm3
    archimedesForceVolumeCm3: function() {
        const a = randomFromList([100,150,200]);
        const V = a / 1e6;
        const d = 10000;
        const correct = d * V;
        const text = `Một quả cầu bằng sắt có thể tích ${formatNumber(a)} $\\text{cm}^3$ được nhúng chìm trong nước, biết khối lượng riêng của nước $1000\\ \\text{kg/m}^3$. Lực đẩy Acsimet tác dụng lên quả cầu là:`;
        const options = generateDistractors(correct, 'N');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' N');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' N'),
            rationale: `$V = ${formatNumber(a)}\\ \\text{cm}^3 = ${formatNumber(V)}\\ \\text{m}^3$; $d = 10\\cdot1000 = 10000\\ \\text{N/m}^3$; $F_A = dV = 10000 \\cdot ${formatNumber(V)} = ${formatNumber(correct)}\\ \\text{N}$.`
        };
    },

    // Q97: lực đẩy với thể tích dm3
    archimedesForceVolumeDm3: function() {
        const a = randomFromList([1,2,4]);
        const V = a / 1000;
        const d = 10000;
        const correct = d * V;
        const text = `Một quả cầu bằng sắt có thể tích ${formatNumber(a)} $\\text{dm}^3$ được nhúng chìm trong nước, biết khối lượng riêng của nước $1000\\ \\text{kg/m}^3$. Lực đẩy Acsimet tác dụng lên quả cầu là:`;
        const options = generateDistractors(correct, 'N');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' N');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' N'),
            rationale: `$V = ${formatNumber(a)}\\ \\text{dm}^3 = ${formatNumber(V)}\\ \\text{m}^3$; $d = 10000\\ \\text{N/m}^3$; $F_A = 10000 \\cdot ${formatNumber(V)} = ${formatNumber(correct)}\\ \\text{N}$.`
        };
    },

    // Q119: mômen ngẫu lực
    momentOfCouple: function() {
        const F = randomFromList([10,20,40]);
        const d = randomFromList([10,20,30]) / 100;
        const correct = F * d;
        const text = `Hai lực của ngẫu lực có độ lớn $F = ${formatNumber(F)}\\ \\text{N}$, khoảng cách giữa hai giá của ngẫu lực là $d = ${formatNumber(d*100)}\\ \\text{cm}$. Mômen của ngẫu lực có độ lớn bằng:`;
        const options = generateDistractors(correct, '$\\text{N}\\cdot\\text{m}$');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' $\\text{N}\\cdot\\text{m}$');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' $\\text{N}\\cdot\\text{m}$'),
            rationale: `$M = Fd = ${formatNumber(F)} \\cdot ${formatNumber(d)} = ${formatNumber(correct)}\\ \\text{N}\\cdot\\text{m}$.`
        };
    },

    // Q120: mômen lực
    momentForce: function() {
        const F = randomFromList([10,20,40]);
        const d = randomFromList([10,20,30]) / 100;
        const correct = F * d;
        const text = `Một lực có độ lớn ${formatNumber(F)} N tác dụng lên một vật rắn quay quanh một trục cố định, biết khoảng cách từ giá của lực đến trục quay là ${formatNumber(d*100)} cm. Mômen của lực tác dụng lên vật có giá trị là:`;
        const options = generateDistractors(correct, '$\\text{N}\\cdot\\text{m}$');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' $\\text{N}\\cdot\\text{m}$');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' $\\text{N}\\cdot\\text{m}$'),
            rationale: `$M = Fd = ${formatNumber(F)} \\cdot ${formatNumber(d)} = ${formatNumber(correct)}\\ \\text{N}\\cdot\\text{m}$.`
        };
    },

    // Q121: lực trên thanh chắn
    forceOnBeam: function() {
        const m = 25;
        const g = 10;
        const AB = 7.5;
        const AG = 1.2;
        const OA = 1.5;
        const P = m * g;
        const OG = OA - AG;
        const OB = AB - OA;
        const correct = P * OG / OB;
        const text = `Một thanh chắn đường AB dài $7,5\\ \\text{m}$; có khối lượng $25\\ \\text{kg}$, có trọng tâm G cách đầu A là $1,2\\ \\text{m}$. Thanh có thể quay quanh một trục O nằm ngang cách đầu A là $1,5\\ \\text{m}$. Để giữ thanh cân bằng nằm ngang thì phải tác dụng lên đầu B một lực bằng bao nhiêu? Lấy $g = 10\\ \\text{m/s}^2$.`;
        const options = generateDistractors(correct, 'N');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' N');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' N'),
            rationale: `$P = 25\\cdot10 = 250\\text{N}$; $OG = 1,5 - 1,2 = 0,3\\text{m}$; $OB = 7,5 - 1,5 = 6\\text{m}$; $F = \\dfrac{P\\cdot OG}{OB} = \\dfrac{250\\cdot0,3}{6} = ${formatNumber(correct)}\\ \\text{N}$.`
        };
    },

    // Q122: lực căng dây
    tensionInRope: function() {
        const m = 30;
        const g = 10;
        const AB = 1.8;
        const AG = 0.6;
        const P = m * g;
        const OG = AB - AG;
        const correct = P * OG / AB;
        const text = `Một thanh gỗ dài $1,8\\ \\text{m}$ nặng $30\\ \\text{kg}$, một đầu được gắn vào trần nhà nhờ một bản lề, đầu còn lại được buộc vào một sợi dây và gắn vào trần nhà sao cho phương của sợi dây thẳng đứng và giữ cho tấm gỗ nằm nghiêng hợp với trần nhà nằm ngang một góc $45^\\circ$. Biết trọng tâm G của thanh gỗ cách đầu gắn sợi dây $60\\ \\text{cm}$. Tính lực căng của sợi dây. Lấy $g = 10\\ \\text{m/s}^2$.`;
        const options = generateDistractors(correct, 'N');
        options.splice(Math.floor(Math.random() * (options.length + 1)), 0, formatNumber(correct) + ' N');
        return {
            text,
            options,
            correct: options.indexOf(formatNumber(correct) + ' N'),
            rationale: `$P = 30\\cdot10 = 300\\text{N}$; $OG = 1,8 - 0,6 = 1,2\\text{m}$; $\\cos45^\\circ$ hủy; $T = \\dfrac{P\\cdot OG}{AB} = \\dfrac{300\\cdot1,2}{1,8} = ${formatNumber(correct)}\\ \\text{N}$.`
        }
    }
};

// Hàm tạo câu hỏi từ template
function generateQuestionFromTemplate(q) {
    if (q.type === 'static') {
        return { ...q };
    }
    const handler = templateHandlers[q.templateId];
    if (handler) {
        return handler();
    } else {
        console.warn('Template not found:', q.templateId);
        return {
            text: 'Câu hỏi chưa được hỗ trợ',
            options: ['A', 'B', 'C', 'D'],
            correct: 0,
            rationale: 'Vui lòng kiểm tra lại dữ liệu.'
        };
    }
}

// Tải dữ liệu
document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            appData = data;
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('setup-screen').classList.remove('hidden');
            populateLessonSelect();
        })
        .catch(error => {
            console.error("Lỗi tải dữ liệu:", error);
            document.getElementById('loading').innerText = "Lỗi tải dữ liệu. Hãy chạy trên local server.";
        });
});

function populateLessonSelect() {
    const select = document.getElementById('lesson-select');
    select.innerHTML = '<option value="all">Tất cả các bài</option>';
    appData.lessons.forEach(lesson => {
        const option = document.createElement('option');
        option.value = lesson.id;
        option.textContent = lesson.name;
        select.appendChild(option);
    });
}

function startQuiz(difficulty) {
    const lessonId = document.getElementById('lesson-select').value;
    let pool = [];

    if (lessonId === 'all') {
        appData.lessons.forEach(l => pool.push(...l.questions));
    } else {
        const lesson = appData.lessons.find(l => l.id === lessonId);
        if (lesson) pool = [...lesson.questions];
    }

    let levelMap = { easy: ['NB', 'TH'], medium: ['NB', 'TH', 'VD'], hard: ['TH', 'VD', 'VDC'] };
    let levels = levelMap[difficulty] || ['NB', 'TH', 'VD', 'VDC'];
    pool = pool.filter(q => levels.includes(q.level));

    pool = pool.sort(() => Math.random() - 0.5);
    const numQuestions = Math.min(pool.length, 20);
    currentQuiz = pool.slice(0, numQuestions).map(q => generateQuestionFromTemplate(q));

    currentIndex = 0;
    score = 0;
    showScreen('quiz-screen');
    updateQuizTitle(difficulty, lessonId);
    showQuestion();
}

function showQuestion() {
    const q = currentQuiz[currentIndex];
    document.getElementById('progress').innerText = `Câu ${currentIndex + 1}/${currentQuiz.length}`;

    let contentHTML = `<span>${q.text}</span>`;
    if (q.image) {
        contentHTML += `<img src="${q.image}" alt="Minh họa" class="question-image">`;
    }
    document.getElementById('question-content').innerHTML = contentHTML;

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = "text-left p-4 border-2 border-gray-200 rounded-xl hover:bg-blue-900 hover:border-blue-200 transition flex items-center";
        btn.innerHTML = `<span class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-sm font-bold text-gray-500">${String.fromCharCode(65+i)}</span> <span>${opt}</span>`;
        btn.onclick = () => checkAnswer(i);
        optionsDiv.appendChild(btn);
    });

    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('next-btn').classList.add('hidden');

    if (window.MathJax) MathJax.typesetPromise();
}

function checkAnswer(selectedIdx) {
    const q = currentQuiz[currentIndex];
    const feedback = document.getElementById('feedback');
    const options = document.getElementById('options').children;

    for (let btn of options) btn.onclick = null;

    if (selectedIdx === q.correct) {
        score++;
        options[selectedIdx].classList.add('bg-green-900', 'border-green-500');
        feedback.innerHTML = `<p class="text-green-50 font-bold">Chính xác!</p><p class="text-sm mt-1">${q.rationale || ''}</p>`;
        feedback.className = "block p-4 bg-green-950 border border-green-200 rounded-lg mb-6";
    } else {
        options[selectedIdx].classList.add('bg-red-900', 'border-red-500');
        options[q.correct].classList.add('bg-green-900', 'border-green-500');
        feedback.innerHTML = `<p class="text-red-50 font-bold">Sai rồi!</p><p class="text-sm mt-1">${q.rationale || ''}</p>`;
        feedback.className = "block p-4 bg-red-950 border border-red-200 rounded-lg mb-6";
    }

    const nextBtn = document.getElementById('next-btn');
    nextBtn.classList.remove('hidden');
    nextBtn.innerText = (currentIndex === currentQuiz.length - 1) ? "Xem kết quả" : "Câu tiếp theo";
    
    if (window.MathJax) MathJax.typesetPromise();
}

document.getElementById('next-btn').onclick = () => {
    currentIndex++;
    if (currentIndex < currentQuiz.length) showQuestion();
    else showResults();
};

function showResults() {
    showScreen('result-screen');
    document.getElementById('score-text').innerText = `${score}/${currentQuiz.length}`;
    const percent = (score / currentQuiz.length) * 100;
    let comment = percent >= 90 ? "Xuất sắc! Bạn đã nắm vững kiến thức." :
                  percent >= 70 ? "Khá tốt! Hãy cố gắng thêm chút nữa nhé." :
                  percent >= 50 ? "Đạt yêu cầu. Bạn nên ôn lại các công thức quan trọng." :
                                  "Bạn cần cố gắng nhiều hơn. Hãy đọc kỹ lại sách giáo khoa.";
    document.getElementById('performance-comment').innerText = comment;
}

function showSetup() {
    showScreen('setup-screen');
}

function showScreen(screenId) {
    ['setup-screen', 'quiz-screen', 'result-screen'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
}

function updateQuizTitle(difficulty, lessonId) {
    let diffName = difficulty === 'easy' ? 'Dễ' : (difficulty === 'medium' ? 'Trung bình' : 'Khó');
    let lessonName = lessonId === 'all' ? 'Tổng hợp' : appData.lessons.find(l => l.id === lessonId).name;
    document.getElementById('quiz-title').innerText = `${lessonName} - Mức ${diffName}`;
}