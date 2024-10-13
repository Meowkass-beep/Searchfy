document.getElementById('botaoBuscar').addEventListener('click', async () => {
    const nomeArtista = document.getElementById('nomeArtista').value;
    const resposta = await fetch(`/artist?name=${encodeURIComponent(nomeArtista)}`);
    const resultado = await resposta.json();

    const divResultado = document.getElementById('resultado');
    divResultado.style.display = 'block';

    if (resultado.error) {
        divResultado.innerHTML = `<p>Erro: ${resultado.error}</p>`;
        return;
    }

    divResultado.innerHTML = `
        <a href="${resultado.external_urls.spotify}" target="_blank">
        <img src="${resultado.images[0]?.url}" alt="Imagem do Artista">
        </a>
        <h2>${resultado.name}</h2>
        <p>Seguidores: ${resultado.followers.total}</p>
        <p>Gêneros: ${resultado.genres.join(', ')}</p>
    `;
});

document.getElementById('botaoTema').addEventListener('click', () => {
    document.body.classList.toggle('tema-escuro');
});
