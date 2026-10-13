/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import FeaturedBento from './components/FeaturedBento.tsx';
import ScrollFeatureShowcase from './components/ScrollFeatureShowcase.tsx';
import ShopByCategory from './components/ShopByCategory.tsx';
import TheCollection from './components/TheCollection.tsx';
import FinishesGallery from './components/FinishesGallery.tsx';
import CraftsmanshipSection from './components/CraftsmanshipSection.tsx';
import Footer from './components/Footer.tsx';
import FloatingWhatsApp from './components/FloatingWhatsApp.tsx';
import ScrollProgressBar from './components/ScrollProgressBar.tsx';
import NoiseGrain from './components/NoiseGrain.tsx';
import CustomCursor from './components/CustomCursor.tsx';
import { Product, PRODUCTS, CategoryFilter, FinishFilter } from './data/products.ts';
import { useScrollReveal } from './hooks/useScrollReveal.ts';

// Performance Code-Splitting: Lazy load modals to minimize initial bundle size
const ProductDetailModal = lazy(() => import('./components/ProductDetailModal.tsx'));
const SearchModal = lazy(() => import('./components/SearchModal.tsx'));
const EnquireModal = lazy(() => import('./components/EnquireModal.tsx'));

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [selectedFinish, setSelectedFinish] = useState<FinishFilter>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [enquireOpen, setEnquireOpen] = useState(false);
  const [enquireItemCode, setEnquireItemCode] = useState<string | undefined>(undefined);

  // Apple-style staggered section scroll reveals
  useScrollReveal();

  // Initialize Lenis smooth scrolling (desktop fine pointer only, respects reduced-motion)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (prefersReducedMotion || isTouch) return;

    let lenisInstance: Lenis | null = null;
    let rafId: number;

    try {
      lenisInstance = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      });

      const raf = (time: number) => {
        if (lenisInstance) {
          lenisInstance.raf(time);
        }
        rafId = requestAnimationFrame(raf);
      };

      rafId = requestAnimationFrame(raf);
    } catch (err) {
      console.warn('Lenis smooth scroll failed to initialize:', err);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenisInstance) lenisInstance.destroy();
    };
  }, []);

  // Hash Routing for /#/product/<slug>
  useEffect(() => {
    const syncHashToProduct = () => {
      const hash = window.location.hash;
      const match = hash.match(/#\/product\/([a-zA-Z0-9_-]+)/);
      if (match) {
        const slug = match[1];
        const found = PRODUCTS.find((p) => p.slug === slug);
        if (found) {
          setSelectedProduct(found);
        }
      } else if (selectedProduct && hash === '') {
        setSelectedProduct(null);
      }
    };

    syncHashToProduct();
    window.addEventListener('hashchange', syncHashToProduct);
    return () => window.removeEventListener('hashchange', syncHashToProduct);
  }, [selectedProduct]);

  // Global keyboard shortcut for search (/ or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || (e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k')) &&
        !searchOpen &&
        !enquireOpen &&
        !selectedProduct
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, enquireOpen, selectedProduct]);

  // Handle selecting product with URL hash
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    window.location.hash = `#/product/${product.slug}`;
  };

  // Handle closing product modal with URL hash cleanup
  const handleCloseProductModal = () => {
    setSelectedProduct(null);
    if (window.location.hash.startsWith('#/product/')) {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
  };

  const handleOpenEnquire = (itemCode?: string) => {
    setEnquireItemCode(itemCode);
    setEnquireOpen(true);
  };

  const handleSelectCategoryFromTiles = (category: CategoryFilter) => {
    setSelectedCategory(category);
    const elem = document.getElementById('collection');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToCollection = () => {
    const elem = document.getElementById('collection');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-[#F5F5F7] selection:bg-[#C9A24B] selection:text-[#000000] relative">
      {/* Sleek Gold Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Tactile Analog Grain Overlay */}
      <NoiseGrain />

      {/* Desktop-Only Custom Precision Cursor with VIEW Badge */}
      <CustomCursor />

      {/* 48px Translucent Header with Apple-Style Navigation */}
      <Navbar
        onOpenSearch={() => setSearchOpen(true)}
        onOpenEnquire={() => handleOpenEnquire()}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Full Viewport 3D Hero */}
        <Hero
          onExploreClick={handleScrollToCollection}
          onEnquireClick={() => handleOpenEnquire()}
        />

        {/* Featured Bento Grid: 2 large + 4 small tiles on #EDE8DF stone panels */}
        <FeaturedBento
          onSelectProduct={handleSelectProduct}
        />

        {/* Pinned Scroll-Driven 3D Feature Metamorphosis (Brass to Black) */}
        <ScrollFeatureShowcase />

        {/* 1. "Shop by Category" Section (Tiles with count badges and hover reveals) */}
        <ShopByCategory
          onSelectCategory={handleSelectCategoryFromTiles}
        />

        {/* 2. "The Collection" Section (4-column responsive grid, sticky filters, architectural cards) */}
        <TheCollection
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedFinish={selectedFinish}
          onSelectFinish={setSelectedFinish}
          onSelectProduct={handleSelectProduct}
          onQuickEnquire={(prod) => handleOpenEnquire(prod.name)}
        />

        {/* Mastered Patinas Gallery */}
        <FinishesGallery
          activeFilter={selectedFinish}
          onSelectFinishFilter={(fin) => setSelectedFinish(fin)}
        />

        {/* Lahore Foundry Craftsmanship Section */}
        <CraftsmanshipSection />
      </main>

      {/* Footer */}
      <Footer onOpenEnquire={() => handleOpenEnquire()} />

      {/* Lazy-Loaded Modals with Suspense */}
      <Suspense fallback={null}>
        {/* Product Detail Modal (Hash URL /#/product/<slug>, zoom on hover, WhatsApp, Complete Set) */}
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={handleCloseProductModal}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {/* Global Search Dialog */}
        {searchOpen && (
          <SearchModal
            isOpen={searchOpen}
            onClose={() => setSearchOpen(false)}
            onSelectItem={(product) => handleSelectProduct(product)}
          />
        )}

        {/* Architectural Enquiry Modal */}
        {enquireOpen && (
          <EnquireModal
            isOpen={enquireOpen}
            onClose={() => setEnquireOpen(false)}
            initialItemCode={enquireItemCode}
          />
        )}
      </Suspense>

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />
    </div>
  );
}
