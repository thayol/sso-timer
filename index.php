<html lang="en-US">
  <head>
    <title>SSO Timer</title>
    <meta charset="utf-8">
    <meta name="author" content="Thayol" >
    <meta name="description" content="A Championship timer for Star Stable Online" >
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <link rel="icon" type="image/png" sizes="32x32" href="src/favicon-32x32.png">
  </head>
  <body>
    <div class="background-image"></div>

    <div class="timer-container">
      <div class="timer-panel">
        <h2>Next Up</h2>
        <h3 class="location-container">The <span id="location">...</span> Championship</h2>
        <p class="championship">at <span id="time">00:00</span></p>
        <p class="remaining">Remaining: <span id="timer">00:00:00</span></p>
      </div>
    </div>

    <div class="days" id="championships_table"></div>

    <script src="script.js"></script>
  </body>
</html>
