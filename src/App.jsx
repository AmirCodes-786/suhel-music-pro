import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { Spinner } from './components/common/Loader';
import ShareLinkHandler from './components/common/ShareLinkHandler';

// Lazy-loaded pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const ArtistPage = lazy(() => import('./pages/ArtistPage'));
const AlbumPage = lazy(() => import('./pages/AlbumPage'));
const PlaylistPage = lazy(() => import('./pages/PlaylistPage'));
const LibraryPage = lazy(() => import('./pages/LibraryPage'));
const QueuePage = lazy(() => import('./pages/QueuePage'));

const App = () => {
  return (
    <>
      <ShareLinkHandler />
      <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<Spinner />}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="/search"
          element={
            <Suspense fallback={<Spinner />}>
              <SearchPage />
            </Suspense>
          }
        />
        <Route
          path="/artist/:id"
          element={
            <Suspense fallback={<Spinner />}>
              <ArtistPage />
            </Suspense>
          }
        />
        <Route
          path="/album/:id"
          element={
            <Suspense fallback={<Spinner />}>
              <AlbumPage />
            </Suspense>
          }
        />
        <Route
          path="/playlist/:id"
          element={
            <Suspense fallback={<Spinner />}>
              <PlaylistPage />
            </Suspense>
          }
        />
        <Route
          path="/library"
          element={
            <Suspense fallback={<Spinner />}>
              <LibraryPage />
            </Suspense>
          }
        />
        <Route
          path="/queue"
          element={
            <Suspense fallback={<Spinner />}>
              <QueuePage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
    </>
  );
};

export default App;
