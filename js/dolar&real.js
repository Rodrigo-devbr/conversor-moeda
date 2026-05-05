document.addEventListener("DOMContentLoaded", () => {

// Variaveis para armazenar os valores do dólar e real

let usdinput = document.querySelector("#usd")
let brlinput = document.querySelector("#brl")
let dolar = 0; // Valor do dólar em reais (exemplo)

// Eventos

usdinput.addEventListener("keyup", () => {
    convert("usd-to-brl") //chamar a função de converter quando o usuario digitar algo no campo de dolar
})

brlinput.addEventListener("keyup", () => {
    convert("brl-to-usd") //chamar a função de converter quando o usuario digitar algo no campo de real
}) 

usdinput.value = "1000,00"
convert("usd-to-brl")

//Funçoes
//A função formatCurrency é responsavel por ajeitar o numero, formatar, e retornar o valor formatado
function formatCurrency(value){
   let fixedValue = fixValue(value)                                  //ajustar o valor
   let options = { useGrouping: false, minimumFractionDigits: 2  }    //"let options" utilizar função de formatar
   let formatter = new Intl.NumberFormat('pt-BR', options)           //retornar o valor formatado
    return formatter.format(fixedValue)
}

function fixValue(value){
    let fixedValue = value.replace(",", ".")//trocando a virgula por ponto
    let floatValue = parseFloat(fixedValue) //transformando a string em numero
    if (isNaN(floatValue)){
        floatValue = 0
    }
    return floatValue
}
function convert(type){
if(type === "usd-to-brl"){
let fixedvalue =  fixValue(usdinput.value)//ajustar o valor
let result = fixedvalue * dolar; //converter o valor
result = result.toFixed(2) //ajustar o valor para 2 casas decimais
brlinput.value = formatCurrency(result)//mostra no campo de brl

}
else if(type === "brl-to-usd"){
    let fixedvalue =  fixValue(brlinput.value)//ajustar o valor
let result = fixedvalue / dolar; //converter o valor
result = result.toFixed(2) //ajustar o valor para 2 casas decimais
usdinput.value = formatCurrency(result)//mostra no campo de usd
}
}

// proximo passo abrir uma requisição para pegar o valor do dolar atualizado, e 

//aquisição do dolar
async function getdollar(){
    try {
        let response = await fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL");

        if (!response.ok) {
            throw new Error("Erro na API");
        }

        let data = await response.json();

        return parseFloat(data.USDBRL?.bid || 0);

    } catch (error) {
        console.error("Erro ao buscar dóplar:", error);
        return 0;
    }
}

async function atualizarTabela() {
       dolar = await getdollar();

    if (dolar === 0) {
        document.getElementById("dolar").textContent = "Erro na API";
        return;
    }

    document.getElementById("dolar").textContent = dolar.toFixed(2);
} 
//Chama a função para atualizar a tabela com o valor do dólar
atualizarTabela();
setInterval(atualizarTabela, 60000); // Atualiza a tabela a cada 60 segundos (60000 milissegundos)      




//aquisição do real
async function getRealEmDolar(){
    try {
        let response = await fetch("https://economia.awesomeapi.com.br/json/last/BRL-USD");

        if (!response.ok) {
            throw new Error("Erro na API");
        }

        let data = await response.json();

        return parseFloat(data.BRLUSD?.bid || 0);

    } catch (error) {
        console.error("Erro ao buscar real:", error);
        return 0;
    }
}

async function atualizarTabelareal() {
    let realEmDolar = await getRealEmDolar();

    if (realEmDolar === 0) {
        document.getElementById("real").textContent = "Erro na API";
        return;
    }

    document.getElementById("real").textContent = realEmDolar.toFixed(2);
} 
atualizarTabelareal();
setInterval(atualizarTabelareal, 60000); // Atualiza a tabela a cada 60 segundos (60000 milissegundos)  

   

//criando grafico 

const canvas = document.getElementById('grafico');

if (!canvas) {
    console.error("Canvas não encontrado");
} else {
    const ctx = canvas.getContext('2d');

    const grafico = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'BRL → USD',
                data: [],
                borderWidth: 2,
                tension: 0.3
            }]
        },
        options: {
            responsive: true
        }
    });

    async function atualizarGrafico() {
        let valor = await getRealEmDolar();
        if (valor === 0) return;

        let agora = new Date().toLocaleTimeString();

        grafico.data.labels.push(agora);
        grafico.data.datasets[0].data.push(valor);

        if (grafico.data.labels.length > 20) {
            grafico.data.labels.shift();
            grafico.data.datasets[0].data.shift();
        }

        grafico.update();
    }

    // roda na hora
    atualizarGrafico();

    // atualiza a cada 7s
    setInterval(atualizarGrafico, 7000);
}







});