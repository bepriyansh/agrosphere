import React from 'react';
import { Typography, Box, type TypographyProps } from '@mui/material';

interface FormattedTextProps extends Omit<TypographyProps, 'children'> {
  text: string;
  color?: string;
  bgColor?: string;
}

const FormattedText: React.FC<FormattedTextProps> = ({ 
  text, 
  color = 'text.secondary',
  bgColor,
  sx,
  ...typographyProps 
}) => {

  const renderTextContent = () => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Regular expression to find bold text (e.g., **text**)
    // We use a non-greedy match (.*?) to ensure it stops at the next two asterisks.
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;

    // Iterate through the text, finding all bold occurrences
    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the bold part. This part will contain original newlines.
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      // Add the bold part as a Typography span with fontWeight="bold"
      parts.push(
        <Typography component="span" fontWeight="bold" key={`bold-${match.index}`}>
          {match[1]}
        </Typography>
      );
      lastIndex = boldRegex.lastIndex;
    }

    // Add any remaining text after the last bold part. This part will also contain original newlines.
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  return (
    <Box
      sx={{
        ...(bgColor && { backgroundColor: bgColor }),
        ...sx,
      }}
    >
      <Typography 
        color={color} 
        whiteSpace="pre-wrap" // This is crucial: it makes the browser respect original newlines ('\n')
        {...typographyProps}
      >
        {renderTextContent()}
      </Typography>
    </Box>
  );
};

export default FormattedText;