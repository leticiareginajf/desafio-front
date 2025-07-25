import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Box, TextField, Grid } from '@mui/material';


const informacoes = [
  {
    id: 1,
    title: "Harry Potter",
    gender: "Filme",
    imageUrl: "https://image.tmdb.org/t/p/w500/lZa5EB6N2sKUmS4a224YJp4yLC.jpg",
  },
  {
    id: 2,
    title: "Demon Slayer",
    gender: "Anime",
    imageUrl: "https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJ9tj4R6E2d.jpg",
  },
  {
    id: 3,
    title: "Naruto",
    gender: "Anime",
    imageUrl: "https://image.tmdb.org/t/p/w500/v124FCo8tXw31nL1eF8flp9F2d.jpg",
  },
  {
    id: 4,
    title: "Coração de Ferro",
    gender: "Série",
    imageUrl: "https://image.tmdb.org/t/p/w500/vQirypMF70b3RFe6h429a3a9aTE.jpg",
  },
];

function ActionAreaCard({ item }) {
  return (
    <Card sx={{ maxWidth: 345, width: '100%' }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={item.imageUrl}
          alt={item.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {item.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Gênero: {item.gender}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
export default function MediaListWithSearch() {

  const [busca, setBusca] = useState('');

  const resultadosFiltrados = informacoes.filter((item) =>
    item.title.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Pesquisa
      </Typography>

      <Box sx={{ marginBottom: 4, display: 'flex', justifyContent: 'center' }}>
        <TextField
          label="Pesquisar por nome..."
          variant="outlined"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          sx={{ width: '50%', minWidth: '300px' }}
        />
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {resultadosFiltrados.map((item) => (
          <Grid item key={item.id}>
            <ActionAreaCard item={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}