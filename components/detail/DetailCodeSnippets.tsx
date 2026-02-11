import React from 'react';
import type { CodeSnippet } from '../../types/index';

interface DetailCodeSnippetsProps {
  snippets: CodeSnippet[];
}

export const DetailCodeSnippets: React.FC<DetailCodeSnippetsProps> = ({ snippets }) => {
  void snippets;
  return null;
};
