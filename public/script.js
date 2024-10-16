document.getElementById('botaoBuscar').addEventListener('click', async () => {
    const nomeArtista = document.getElementById('nomeArtista').value;
    const divResultado = document.getElementById('resultado');

    try {
        const resposta = await fetch(`/api/artist?name=${encodeURIComponent(nomeArtista)}`);
        if (!resposta.ok) {
            throw new Error(`Erro: ${resposta.status}`);
        }
        const resultado = await resposta.json();
        
        divResultado.style.display = 'block';

        if (resultado.error) {
            divResultado.innerHTML = `<p>Erro: ${resultado.error}</p>`;
            return;
        }

        const generos = resultado.genres.length > 0 ? resultado.genres.join(', ') : 'não informado';

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
        divResultado.innerHTML = `<p>${error.message}</p>`;
    }
});

document.getElementById('botaoTema').addEventListener('click', () => {
    const temaEscuroAtivo = document.body.classList.toggle('tema-escuro');

    if (temaEscuroAtivo) {
        document.getElementById('botaoTema').innerHTML = 'Tema Claro <i class="fa-solid fa-sun"></i>';
    } else {
        document.getElementById('botaoTema').innerHTML = 'Tema Escuro <i class="fa-solid fa-moon"></i>';
    }
});