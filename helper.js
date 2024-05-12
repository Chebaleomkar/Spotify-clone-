import axios from 'axios';

async function regSw () {
  if ('serviceWorker' in navigator) {
    
    const reg = await navigator.serviceWorker.register ('/sw.js', {scope: '/'});
    console.log ('service config is', {reg});
    return reg;
  }
  throw Error ('serviceworker not supported');
}

async function subscribe (serviceWorkerReg) {
    let subscription = await serviceWorkerReg.pushManager.getSubscription ();
    console.log ({subscription});
    if (subscription === null) {
      subscription = await serviceWorkerReg.pushManager.subscribe ({
        userVisibleOnly: true,
        applicationServerKey: 'BPdnSlV3i08SZSRb9mJi-olMvXvR4fzLGEWaLGUUjY3qq5OjF1pkrIx4xe6tGWIOoQzqq8hXdR6BRXjdUGI8TwA',
      });
    }
    try{
     const res = await axios.post ('http://localhost:9000/subscribe', subscription);
       console.log(res);
    }
    catch(err){
      console.log(err);
    }
}

  export {regSw, subscribe};