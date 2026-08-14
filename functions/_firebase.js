import {cert,getApps,initializeApp} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';

let firestore;

const serviceAccount=()=>{
  if(process.env.FIREBASE_SERVICE_ACCOUNT){
    const parsed=JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    return {
      projectId:parsed.project_id||parsed.projectId,
      clientEmail:parsed.client_email||parsed.clientEmail,
      privateKey:String(parsed.private_key||parsed.privateKey||'').replace(/\\n/g,'\n')
    };
  }

  if(process.env.FIREBASE_PROJECT_ID&&process.env.FIREBASE_CLIENT_EMAIL&&process.env.FIREBASE_PRIVATE_KEY){
    return {
      projectId:process.env.FIREBASE_PROJECT_ID,
      clientEmail:process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g,'\n')
    };
  }

  return null;
};

export const isFirestoreConfigured=()=>Boolean(
  process.env.FIREBASE_SERVICE_ACCOUNT||
  (process.env.FIREBASE_PROJECT_ID&&process.env.FIREBASE_CLIENT_EMAIL&&process.env.FIREBASE_PRIVATE_KEY)
);

export const getTripFirestore=()=>{
  if(firestore)return firestore;
  const account=serviceAccount();
  if(!account)throw new Error('Firestore is not configured.');
  const app=getApps()[0]||initializeApp({credential:cert(account)});
  firestore=getFirestore(app);
  return firestore;
};
