// api/artist.js
import fetch from 'node-fetch';
import btoa from 'btoa';

export default async function handler(req, res) {
    // Verifica se a requisição é do tipo GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const nomeArtista = req.query.name;

    // Verifica se o nome do artista foi fornecido
    if (!nomeArtista) {
        return res.status(400).json({ error: 'Nome do artista é obrigatório' });
    }

    try {
        const { clientId, clientSegredo } = await getSpotifyCredentials();
        
        const parametros = new URLSearchParams();
        parametros.append('grant_type', 'client_credentials');

        // Obtendo o token de acesso
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(`${clientId}:${clientSegredo}`),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: parametros,
        });

        // Verifica se a requisição do token foi bem-sucedida
        if (!tokenResponse.ok) {
            throw new Error('Erro ao obter token de acesso');
        }

        const dataToken = await tokenResponse.json();
        const tokenAcesso = dataToken.access_token;

        // Realizando a busca pelo artista
        const resultadoBusca = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(nomeArtista)}&type=artist`, {
            headers: {
                'Authorization': `Bearer ${tokenAcesso}`,
            },
        });

        // Verifica se a busca foi bem-sucedida
        if (!resultadoBusca.ok) {
            throw new Error('Erro ao buscar artista');
        }

        const dadosBusca = await resultadoBusca.json();
        const artista = dadosBusca.artists.items[0];

        // Verifica se o artista foi encontrado
        if (!artista) {
            return res.status(404).json({ error: 'Artista não encontrado' });
        }

        // Retorna os dados do artista
        res.status(200).json(artista);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: 'Erro ao acessar API do Spotify' });
    }
}

// Função para obter as credenciais do Spotify
async function getSpotifyCredentials() {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSegredo = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSegredo) {
        throw new Error('Credenciais do Spotify não configuradas');
    }

    return { clientId, clientSegredo };
}
