// Seleciona os elementos do formulário.
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Captura o evento de input.
amount.oninput = () => {
  // Remove os caracteres não numéricos.
  let value = amount.value.replace(/\D/g, "")
  
  /* 
    Pra funcionar o toLocaleString, é preciso estar em centavos.
    Transforma o valor em centavos (exemplo: 150/100 = 1.5 que é equivalente a R$ 1,50).
  */
  value = Number(value) / 100

  // Atualiza o valor do input.
  amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
  // Formata o valor no padrão BRL (Real Brasileiro).
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  // Retorna o valor formatado.
  return value
}

// Captura o evento submit do formulário para obter os valores.
form.onsubmit = (event) => {
  // Previne o comportamento padrão de recarregar a página.
  event.preventDefault()

  // Cria um objeto com os detalhes na nova despesa.
  const newExpense = {
    // Para um identificador única, usando estratégia de pegar o timestamp.
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    // Dentro das opções de categoria, ele pega pelo índice, o texto da opção selecionada.
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    // Sinaliza quando a despeza foi criada.
    create_at: new Date(),
  }
}