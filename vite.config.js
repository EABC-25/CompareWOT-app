import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// import path from 'path';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    plugins: [react()],
  };
});

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// export default defineConfig(({ command, mode }) => {
//   // Construct the path to the environment files in the /config directory
//   const envDir = path.resolve(process.cwd(), '/config');
//   // Load env file based on `mode` in the current working directory.
//   // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
//   const env = loadEnv(mode, envDir, '');

//   // console.log('Loaded environment variables:', env);
//   return {
//     // vite config
//     define: {
//       'process.env': env,
//       __APP_ENV__: JSON.stringify(env.APP_ENV),
//     },
//     plugins: [react()],
//     envDir,
//   };
// });
