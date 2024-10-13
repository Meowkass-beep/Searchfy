document.getElementById('botaoBuscar').addEventListener('click', async () => {
    const nomeArtista = document.getElementById('nomeArtista').value;
    const divResultado = document.getElementById('resultado');

    try {
        const resposta = await fetch(`/api/artist?name=${encodeURIComponent(nomeArtista)}`); // Ajuste aqui para /api/artist
        if (!resposta.ok) {
            throw new Error(`Erro: ${resposta.status}`);
        }
        const resultado = await resposta.json();
        
        divResultado.style.display = 'block';

        // Verifica se há erro no resultado da API
        if (resultado.error) {
            divResultado.innerHTML = `<p>Erro: ${resultado.error}</p>`;
            return;
        }

        // Verifica se genres é um array vazio e define o valor padrão
        const generos = resultado.genres.length > 0 ? resultado.genres.join(', ') : 'não informado';

        // Atualiza o HTML com os dados do artista
        divResultado.innerHTML = `
            <a href="${resultado.external_urls.spotify}" target="_blank">
                <img src="${resultado.images[0]?.url}" alt="Imagem do Artista">
            </a>
            <h2>${resultado.name}</h2>
            <p>Seguidores: ${resultado.followers.total}</p>
            <p>Gêneros: ${generos}</p>
        `;
    } catch (error) {
        console.error('Erro:', error);
        divResultado.style.display = 'block';
        divResultado.innerHTML = `<p>${error.message}</p>`; // Mostra o erro no HTML
    }
});

// Tema escuro
document.getElementById('botaoTema').addEventListener('click', () => {
    document.body.classList.toggle('tema-escuro');
});
