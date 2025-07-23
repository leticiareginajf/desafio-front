// src/components/MovieCard/MovieCard.tsx
import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

interface MovieCardProps {
  movie: {
    title: string;
    year: number;
    posterUrl: string;
  };
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <Card sx={{ maxWidth: 250, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="300" // Altura fixa para as capas
        image={movie.posterUrl}
        alt={movie.title}
        sx={{ objectFit: 'cover' }} // Garante que a imagem preencha a área
      />
      <CardContent sx={{ flexGrow: 1 }}> {/* Faz com que o CardContent ocupe o espaço restante */}
        <Typography variant="h6" component="div" gutterBottom sx={{ lineHeight: 1.2 }}>
          {movie.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {movie.year}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MovieCard;