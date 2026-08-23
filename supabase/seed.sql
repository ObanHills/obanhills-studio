-- supabase/seed.sql
-- Run this in the Supabase SQL Editor to populate the projects table with
-- 5 sample ObanHills projects.
--
-- Make sure you have already run the schema SQL from the project spec first.

INSERT INTO public.projects (slug, title, description, likes_count)
VALUES
  (
    'digital-terrain-engine',
    'Digital Terrain Engine',
    'A WebGL-powered procedural terrain generator using simplex noise and real-time vertex displacement. Built with Three.js and custom GLSL shaders to simulate living, breathing landscapes at 60fps.',
    0
  ),
  (
    'neural-type-foundry',
    'Neural Type Foundry',
    'An AI-assisted variable font design system that uses machine learning to generate and morph typeface letterforms in real time. Trained on 4,000+ historical typefaces from the 15th century onward.',
    0
  ),
  (
    'soundscape-visualiser',
    'Soundscape Visualiser',
    'A real-time audio reactive 3D visualiser built with the Web Audio API and React Three Fiber. Frequency bands drive particle emitters, camera movements, and post-processing intensities live.',
    0
  ),
  (
    'spatial-ui-kit',
    'Spatial UI Kit',
    'A component library for building immersive 3D user interfaces in the browser. Includes panels, buttons, sliders, and data grids that exist in three-dimensional space and react to user gaze and gesture.',
    0
  ),
  (
    'obanhills-os',
    'ObanHills OS',
    'A conceptual web-based operating system with a fully spatial desktop environment. Windows float in 3D space, apps open with physics-based animations, and the file system is visualised as an explorable world.',
    0
  );
