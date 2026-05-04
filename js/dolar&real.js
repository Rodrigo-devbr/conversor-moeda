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
    if (floatValue == NaN){
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
    let dolar = await getdollar();

    document.getElementById("dolar").textContent = dolar.toFixed(2);
} 

atualizarTabela();

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

    document.getElementById("real").textContent = realEmDolar.toFixed(2);
} 
atualizarTabelareal();











