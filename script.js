// Seleciona os elementos do formulário.
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Seleciona os elementos da lista (A LISTA UL).
const expenseList = document.querySelector("ul")
const expensesTotal = document.querySelector("aside header h2")
const expensesQuantity = document.querySelector("aside header p span")

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
  let newExpense = {
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

  // Chama a função que irá adicionar o item na lista.
  expenseAdd(newExpense)
}

function expenseAdd(newExpense) {
  try {
    // Cria o elemento para adicionar o item (li) na lista (ul).
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    // Cria o ícone da categoria.
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    // Cria a info da despesa.
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    // Cria o nome da despesa.
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    // Cria a categoria da despesa.
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    // Adiciona nome e categoria na div das informações da despesa.
    expenseInfo.append(expenseName, expenseCategory)

    // Cria o valor da despesa.
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`

    const expenseRemove = document.createElement("img")
    expenseRemove.classList.add("remove-icon")
    expenseRemove.setAttribute("src", "img/remove.svg")
    expenseRemove.setAttribute("alt", "remover")

    // Adiciona as informações no item.
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, expenseRemove)

    // Adiciona o item na lista.
    expenseList.append(expenseItem)

    // Atualiza os totais.
    updateTotals()
  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas.")
    console.log(error)
  }
}

function updateTotals() {
  try {
    /* 
      Recupera todos os itens (li) da lista (ul)
      CHILDREN trás os filhos
    */ 
    const items = expenseList.children
    
    expensesQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`

    // Variável para incrementar o total.
    let total = 0

    // Percorre cada item (li) da lista (ul).
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount")

      // Remove caracteres não numéricos e substitui a vírgula pelo ponto.
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")
      // console.log(value)
      // Converte o valor para float.
      value = parseFloat(value)

      // Verifica se é um número válido.
      if (isNaN(value)) {
        return alert("Não foi possível calcular o total. O valor não parece ser um número.")
      }

      // Incrementa o valor total.
      total += Number(value)
    }

    // Cria a small para adicionar o R$ formatado.
    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"

    // Formata o valor e remove o R$, já que será exibido pela small com um estilo customizado.
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

    // Limpa o conteúdo do elemento.
    expensesTotal.innerHTML = ""

    expensesTotal.append(symbolBRL, total)
  } catch (error) {
    console.log(error)
    alert("Não foi possível atualizar os totais.")
  }
}

// Evento que captura o clique nos itens da lista.
expenseList.addEventListener("click", function (event) {
  // Verifica se o elemento clicado é o ícone de remover.
  if (event.target.classList.contains("remove-icon")) {
    /* 
      Obtém a li pai do elemento clicado. 
      CLOSEST -> O pai mais próximo
    */
    const item = event.target.closest(".expense")
    
    // Remove item da lista.
    item.remove()
  }

  // Atualiza os totais.
  updateTotals()
})
