import fetch from 'node-fetch';
import btoa from 'btoa';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const nomeArtista = req.query.name;

    if (!nomeArtista) {
        return res.status(400).json({ error: 'Nome do artista é obrigatório' });
    }

    try {
        const { clientId, clientSegredo } = await getSpotifyCredentials();
        
        const parametros = new URLSearchParams();
        parametros.append('grant_type', 'client_credentials');

        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(`${clientId}:${clientSegredo}`),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: parametros,
        });

        if (!tokenResponse.ok) {
            throw new Error('Erro ao obter token de acesso');
        }

        const dataToken = await tokenResponse.json();
        const tokenAcesso = dataToken.access_token;

        const resultadoBusca = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(nomeArtista)}&type=artist`, {
            headers: {
                'Authorization': `Bearer ${tokenAcesso}`,
            },
        });

        if (!resultadoBusca.ok) {
            throw new Error('Erro ao buscar artista');
        }

        const dadosBusca = await resultadoBusca.json();
        const artista = dadosBusca.artists.items[0];

        if (!artista) {
            return res.status(404).json({ error: 'Artista não encontrado' });
        }

        res.status(200).json(artista);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: 'Erro ao acessar API do Spotify' });
    }
}

async function getSpotifyCredentials() {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSegredo = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSegredo) {
        throw new Error('Credenciais do Spotify não configuradas');
    }

    return { clientId, clientSegredo };
}
