<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">


    
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/ol@v8.2.0/dist/ol.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@v8.2.0/ol.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="/assets/CSS/pesquet.css">

    <title>Tweet comme ta daronne</title>
  </head>

  <body>

    <div class='header'>
    <div class="container">
      <h2>Tweet comme Pesquet</h2>
    </div>
    
    <div id="app">
    
    
    <div class="fond-map-container">
    <img alt="fond" title="fond" src="/assets/CSS/fond.png" class="fond-image"/>
    <div class='carte' id='map'></div>
    <div class="align-items">
    <button class="button-futuriste" @click="toggleFollowPoint">{{ followPoint ? "Disable" : "Enable" }}</button>
    <p>{{lat}}, {{lon}}</p>
    </div>

    
    </div>

    <form id="tweet" @submit.prevent="Tweet">
        <input type="radio" id="smartphone" name="zoom" value="7" v-model="selectedZoom">
        <label for="smartphone">Smartphone</label><br>

        <input type="radio" id="reflex" name="zoom" value="10" v-model="selectedZoom">
        <label for="reflex">Réflex</label><br>

        <input type="radio" id="teleobjectif" name="zoom" value="13" v-model="selectedZoom">
        <label for="teleobjectif">Téléobjectif</label><br>

        <!-- Change the button type to "button" to prevent default form submission -->
        <button type="submit" @click="Tweet">Tweet comme Prigosquest</button>
    </form>
    <img :src="url" alt="alternative_text">
    </div>


    </div>
    
    <div class='boulot'></div>
    <div class="footer"></div>
    <script src="https://cdn.jsdelivr.net/npm/vue"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script src="/assets/JS/pesquet.js"></script>
    
    
    
  </body>
</html>
