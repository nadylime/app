import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {readFileSync} from 'node:fs';

const appVersion=process.env.COMMIT_REF||process.env.DEPLOY_ID||'dev';

export default defineConfig({
  define:{__APP_VERSION__:JSON.stringify(appVersion)},
  plugins:[
    react(),
    {
      name:'emit-app-version',
      generateBundle(_,bundle){
        this.emitFile({type:'asset',fileName:'version.json',source:JSON.stringify({version:appVersion})});
        const generated=Object.values(bundle).map(item=>`/${item.fileName}`);
        const precache=[
          '/','/index.html','/manifest.webmanifest','/colorado-trip-logo.png',
          '/favicon-32.png','/favicon-64.png','/apple-touch-icon.png',...generated
        ];
        const template=readFileSync(new URL('./service-worker.js',import.meta.url),'utf8');
        const source=template
          .replace('__BUILD_VERSION__',JSON.stringify(appVersion))
          .replace('__PRECACHE_URLS__',JSON.stringify([...new Set(precache)]));
        this.emitFile({type:'asset',fileName:'sw.js',source});
      }
    }
  ]
});
