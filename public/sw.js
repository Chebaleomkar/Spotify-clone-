this.addEventListener('activate', function (event) {
  console.log('service worker activated');
});

this.addEventListener('push', async function (event) {
  const message = await event.data.json ();
  let {title, description, image} = message;
  console.log ({message});
  await event.waitUntil (
    this.registration.showNotification (title, {
      body: description,
      icon: image,
      actions: [
        {
          action: 'accept',
          title: 'Accept'
        },
        {
          action: 'reject',
          title: 'Reject'
        }
      ],
    })
  );
});