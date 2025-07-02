import React, { useRef, useState, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import { styled } from '@mui/system';

interface PostCarouselProps {
  images: string[];
}

const CarouselContainer = styled(Box)({
  display: 'flex',
  overflowX: 'auto',
  gap: '8px',
  scrollSnapType: 'x mandatory',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none', 
  '&::-webkit-scrollbar': { display: 'none' }, 
});

const ImageWrapper = styled(Box)({
  flexShrink: 0,
  width: '100%',
  height: '400px',
  scrollSnapAlign: 'center',
  position: 'relative',
  overflowY: 'hidden'
});

const Image = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const DotContainer = styled(Stack)({
  position: 'absolute',
  bottom: 8,
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  gap: 6,
});

const Dot = styled('div')<{ active: boolean }>(({ active }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: active ? '#1976d2' : '#ccc',
  transition: 'all 0.3s ease',
}));

const PostCarousel: React.FC<PostCarouselProps> = ({ images }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, offsetWidth } = containerRef.current;
      const index = Math.round(scrollLeft / offsetWidth);
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box position="relative">
      <CarouselContainer ref={containerRef}>
        {images.map((img, index) => (
          <ImageWrapper key={index}>
            <Image src={img} alt={`Post image ${index + 1}`} />
          </ImageWrapper>
        ))}
      </CarouselContainer>

      {images.length > 1 && (
        <DotContainer direction="row">
          {images.map((_, index) => (
            <Dot key={index} active={index === currentIndex} />
          ))}
        </DotContainer>
      )}
    </Box>
  );
};

export default PostCarousel;
