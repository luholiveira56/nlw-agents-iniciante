const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')

const markdownToHTML = (text) => {
  const converter = new showdown.Converter()
  return converter.makeHtml(text)
}

// AIzaSyC5LgYOYcSX_REg8u1BvUBc74iClfZcqaA
const perguntarAI = async (question, game, apiKey) => {
  const model = "gemini-2.5-flash"
  const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  const perguntaLOL = `
    ## Especialidade
    Você é um especilista assistente de meta para o jogo ${game}
    
    ## Tarefa
    Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas
    
    ## Regras
    - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
    - Se a pergunta não está relacionada ao jogo, respota com 'Essa pergunta não está relacionada ao jogo'
    - Considere a data atual ${new Date().toLocaleDateString()}
    - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
    - Nunca responda itens que você não tenha certeza de que existe no patch atual.
    
    ## Resposta
    - Economize na resposta, seja direto e resposta no máximo 500 caracteres
    - Responda em markdown
    - Não precisa fazer nenhuma saudação ou despedida, apenas a responda o que o usuário está querendo

    ## Exemplo de resposta
    pergunta do usuário: Melhor build rengar jungle
    resposta: A build mais atual é: \n\n **Itens:**\n\n Coloque os itens aqui. \n\n**Runas:**\n\nexemplo de runas\n\n

    ---
    Aqui está a pergunta do usuário: ${question}
  `
  const perguntaValorant = `
    ## Especialidade
    Você é um especilista assistente de meta para o jogo ${game}
    
    ## Tarefa
    Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas
    
    ## Regras
    - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
    - Se a pergunta não está relacionada ao jogo, respota com 'Essa pergunta não está relacionada ao jogo'
    - Considere a data atual ${new Date().toLocaleDateString()}
    - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
    - Nunca responda itens que você não tenha certeza de que existe no patch atual.
    
    ## Resposta
    - Economize na resposta, seja direto e resposta no máximo 500 caracteres
    - Responda em markdown
    - Não precisa fazer nenhuma saudação ou despedida, apenas a responda o que o usuário está querendo

    ## Exemplo de resposta
    pergunta do usuário: Quais são os melhores agentes controladores para o mapa Icebox e por que?
    resposta: **Controladores:**\n\n Coloque os controladores aqui.\n\n **No mapa:**\n\n Coloque o nome do mapa aqui. \n\n**Motivo:**\n\nexplicação do por que dessa escolha coloque aqui.\n\n

    ---
    Aqui está a pergunta do usuário: ${question}
  `
  const perguntaCSGO = `
    ## Especialidade
    Você é um especilista assistente de meta para o jogo ${game}
    
    ## Tarefa
    Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas
    
    ## Regras
    - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
    - Se a pergunta não está relacionada ao jogo, respota com 'Essa pergunta não está relacionada ao jogo'
    - Considere a data atual ${new Date().toLocaleDateString()}
    - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
    - Nunca responda itens que você não tenha certeza de que existe no patch atual.
    
    ## Resposta
    - Economize na resposta, seja direto e resposta no máximo 500 caracteres
    - Responda em markdown
    - Não precisa fazer nenhuma saudação ou despedida, apenas a responda o que o usuário está querendo

    ## Exemplo de resposta
    pergunta do usuário: Qual a melhor estratégia para segurar o bombsite B no mapa Mirage como CT?
    resposta: **Estratégia:**\n\nColoque a estratégia aqui.\n\n **No mapa:**\n\n Coloque o nome do mapa aqui. \n\n**Itens:**\n\nexemplo de itens para estratégia\n\n

    ---
    Aqui está a pergunta do usuário: ${question}
  `

  let pergunta = ''

  if (game == 'valorant') {
    pergunta = perguntaValorant
  } else if (game == 'lol') {
    pergunta = perguntaLOL
  } else if (game == 'csgo') {
    pergunta = perguntaCSGO
  }

  const contents = [{
    role: "user",
    parts: [{
      text: pergunta
    }]
  }]

  const tools = [{
    google_search: {}
  }]

  // Chamada API
  const response = await fetch(geminiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents,
      tools
    })
  })

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}

const enviarFormulario = async (event) => {
  event.preventDefault()
  const apiKey = apiKeyInput.value
  const game = gameSelect.value
  const question = questionInput.value

  if (apiKey == '' || game == '' || question == '') {
    alert('Por favor, preencha todos os campos')
    return
  }

  askButton.disabled = true
  askButton.textContent = 'Perguntando...'
  askButton.classList.add('loading')

  try {
    const text = await perguntarAI(question, game, apiKey)
    aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
    aiResponse.classList.remove('hidden')
  } catch (error) {
    console.log('Erro: ', error)
  } finally {
    askButton.disabled = false
    askButton.textContent = 'Perguntar'
    askButton.classList.remove('loading')
  }
}
form.addEventListener('submit', enviarFormulario)