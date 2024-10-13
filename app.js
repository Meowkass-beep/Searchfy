import express from 'express';
import fs from 'fs/promises';
import fetch from 'node-fetch';
import btoa from 'btoa';

const app = express();
const port = 3000;

async function getSpotifyCredentials() {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSegredo = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSegredo) {
        throw new Error('Credenciais do Spotify não configuradas');
    }

    return { clientId, clientSegredo };
}

app.use(express.static('public'));

app.get('/artist', async (req, res) => {
    const nomeArtista = req.query.name;

    try {
        const { clientId, clientSegredo } = await getSpotifyCredentials();
        
        const parametros = new URLSearchParams();
        parametros.append('grant_type', 'client_credentials');

        const token = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(`${clientId}:${clientSegredo}`),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: parametros,
        });

        const dataToken = await token.json();
        const tokenAcesso = dataToken.access_token;

        const resultadoBusca = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(nomeArtista)}&type=artist`, {
            headers: {
                'Authorization': `Bearer ${tokenAcesso}`,
            },
        });

        const dadosBusca = await resultadoBusca.json();
        const artista = dadosBusca.artists.items[0];

        if (!artista) {
            return res.status(404).json({ error: 'Artista não encontrado' });
        }

        res.json(artista);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro ao acessar API do Spotify');
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
