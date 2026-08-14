import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const appVersion=process.env.COMMIT_REF||process.env.DEPLOY_ID||'dev';

export default defineConfig({
  define:{__APP_VERSION__:JSON.stringify(appVersion)},
  plugins:[
    react(),
    {
      name:'emit-app-version',
      generateBundle(){
        this.emitFile({type:'asset',fileName:'version.json',source:JSON.stringify({version:appVersion})});
      }
    }
  ]
});
