import { useState, useRef } from 'react';

/**
 * Çoklu sayfa yönetimi hook'u.
 */
export const usePages = (items, setItems, strokes, setStrokes) => {
  const [pages, setPages] = useState([{ id: 1, label: 'Sayfa 1' }]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageData = useRef({});

  const switchPage = (pageId) => {
    pageData.current[currentPage] = { items, strokes };
    setCurrentPage(pageId);
    const saved = pageData.current[pageId];
    if (saved) {
      setItems(saved.items || []);
      setStrokes(saved.strokes || []);
    } else {
      setItems([]);
      setStrokes([]);
    }
  };

  const addPage = () => {
    const newId = pages.length > 0
      ? Math.max(...pages.map((p) => p.id)) + 1
      : 1;
    setPages((prev) => [...prev, { id: newId, label: 'Sayfa ' + newId }]);
    switchPage(newId);
  };

  const deletePage = (pageId) => {
    if (pages.length <= 1) return;
    delete pageData.current[pageId];
    setPages((prev) => prev.filter((pg) => pg.id !== pageId));
    if (currentPage === pageId) {
      const remaining = pages.filter((pg) => pg.id !== pageId);
      if (remaining.length > 0) switchPage(remaining[0].id);
    }
  };

  return { pages, currentPage, switchPage, addPage, deletePage };
};
