'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "fc62c14037803cce5e4afe6b90a75a8f",
"assets/assets/ascendant_plane.png": "03cb1791f6fd1c1cd1c57745e483e7d0",
"assets/assets/black_garden.png": "826004fa91bd429cfce6b9fd7b14342f",
"assets/assets/black_heart.png": "77c086396f0af9476aac45e23ef147a6",
"assets/assets/blank.png": "e0bfa8e48acb12cabb509c584d479af8",
"assets/assets/commune.png": "62cb7e4dc9758c1418fd6755e5d9c69e",
"assets/assets/darkness.png": "a7b61928b6c08d36adf6125a788344df",
"assets/assets/drink.png": "a108fd5f42a50e7bbd39e456a7474d59",
"assets/assets/earth.png": "cbb375e9fa60ecda321fd6967a97a2e9",
"assets/assets/enter.png": "4b6a4abda42fba2219e265898620a04c",
"assets/assets/fleet.png": "05817f1a3a31585fd41ec9f5e8af49ed",
"assets/assets/give.png": "7e4d0dd74fcff124995a5e0633e8320f",
"assets/assets/grieve.png": "2ac5f157befd9afb88a3243cc346b65b",
"assets/assets/guardian.png": "f19247c5f9609ac878c2a59d16c21725",
"assets/assets/hive.png": "b84b99260091f78e8c2b3e4dbae98b05",
"assets/assets/kill.png": "ef811b9c04079502a45369f68dee7382",
"assets/assets/knowledge.png": "5a9238b37b19771e51b398f3d7afe393",
"assets/assets/light.png": "0f35a44d3336b54adbd98013dcf2ff6a",
"assets/assets/love.png": "d194e252b2831df37f4921f5420db4a9",
"assets/assets/pyramid.png": "6fc99baa7e786c8be79594ab14c9c67b",
"assets/assets/savathun.png": "c6c1d0497dfd7873d50afbd5efcd7fd9",
"assets/assets/scorn.png": "0394e65f20531762a3157efa75511ee6",
"assets/assets/stop.png": "5692ce21ac7dc73d746238bd7434813c",
"assets/assets/tower.png": "eae1b4f765121554d38f7cf5d2aebbf2",
"assets/assets/traveller.png": "1588ca3b1f88baf422c09293e33939e2",
"assets/assets/vow_icons.png": "6f1653e95f9268693b06ed6e53f77ec1",
"assets/assets/witness.png": "d09f944c2c96a86554809dde84de25a8",
"assets/assets/worm.png": "d53f5d893c3a71a76af22c0faac5da6f",
"assets/assets/worship.png": "2a109af9df43b6d945db002cc8292daa",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/NOTICES": "665887f43b5974801ec87cde54e51b9f",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "62b9906717d7215a6ff4cc24efbd1b5c",
"canvaskit/canvaskit.wasm": "b179ba02b7a9f61ebc108f82c5a1ecdb",
"canvaskit/profiling/canvaskit.js": "3783918f48ef691e230156c251169480",
"canvaskit/profiling/canvaskit.wasm": "6d1b0fc1ec88c3110db88caa3393c580",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "767e1b10d404ff14a87dbb264c45b332",
"/": "767e1b10d404ff14a87dbb264c45b332",
"main.dart.js": "c150398c70e1a741aceb53cd78d95d8b",
"manifest.json": "dedbe79d4fdc73ba5bafedc191a795ff",
"version.json": "f99af18f9fc3c7a071e476d2a04755f5"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
