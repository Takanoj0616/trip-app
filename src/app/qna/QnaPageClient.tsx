'use client';

import { useState, useMemo } from 'react';
import AnimationClient from '@/components/AnimationClient';
import Hero from '@/components/qa/Hero';
import Controls from '@/components/qa/Controls';
import Card from '@/components/qa/Card';
import Pagination from '@/components/qa/Pagination';
import EmptyState from '@/components/qa/EmptyState';
import Footer from '@/components/qa/Footer';
import SakuraAnimation from '@/components/qa/SakuraAnimation';
import { qaData } from '@/data/qaData';
import { Category, SortOption } from '@/types/qa';
import '@/styles/qa-theme.css';

export default function QnaPageClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedSort, setSelectedSort] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredAndSortedData = useMemo(() => {
    let filtered = qaData;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item => 
          item.title.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query) ||
          item.tags.some(tag => tag.toLowerCase().includes(query))
      );
      console.log('GA4 Event: qa_search', { query: searchQuery, results: filtered.length });
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
      console.log('GA4 Event: qa_filter_change', { category: selectedCategory, results: filtered.length });
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (selectedSort) {
        case 'views':
          return b.views - a.views;
        case 'votes':
          return b.votes - a.votes;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return sorted;
  }, [searchQuery, selectedCategory, selectedSort]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset page when filters change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setSelectedSort(sort);
    setCurrentPage(1);
  };

  return (
    <>
      <AnimationClient />
      <SakuraAnimation />
      
      {/* Japanese themed background */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 japanese-gradient seigaiha-pattern"
      />
      
      {/* Sakura particles container */}
      <div className="sakura-particles" id="sakuraParticles" aria-hidden="true" />
      
      <div className="min-h-screen" style={{ paddingTop: '120px' }}>
        <Hero />
        
        <Controls 
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          selectedSort={selectedSort}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
        />

        {/* Q&A Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
          {paginatedData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {paginatedData.map((item) => (
                  <Card key={item.id} item={item} />
                ))}
              </div>
              
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <EmptyState 
              searchQuery={searchQuery}
              category={selectedCategory}
            />
          )}
        </div>
        
        <Footer />
      </div>
    </>
  );
}