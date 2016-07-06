(function() {
  'use strict';

  const i2c = require("i2c");
  const fs = require('fs');
  const ini = require('ini');
  const exec = require('child_process').exec;
  const chalk = require("chalk");
  const request = require('request');
  const myIP = require('my-ip');

  let mopidy = ini.parse(fs.readFileSync('/etc/mopidy/mopidy.conf', 'utf-8'));
  console.log(chalk.cyan('configuring Mopidy from env vars...'));

  // http config
  mopidy.http.port = process.env.MOPIDY_HTTP_PORT || "8080";
  mopidy.http.hostname = myIP();

  // mpd config
  mopidy.mpd.port = process.env.MOPIDY_MPD_PORT || "6680";
  mopidy.mpd.hostname = myIP();

  // audio config
  mopidy.audio.mixer_volume = process.env.MOPIDY_AUDIO_MIXER_VOLUME || "50";

  // Google Play Music config
  mopidy.gmusic.enabled = process.env.MOPIDY_GMUSIC_ENABLED || "false";
  mopidy.gmusic.username = process.env.MOPIDY_GMUSIC_USERNAME || "none";
  mopidy.gmusic.password = process.env.MOPIDY_GMUSIC_PASSWORD || "none";
  mopidy.gmusic.all_access = process.env.MOPIDY_GMUSIC_ALL_ACCESS || "false";
  // Spotify config
  mopidy.spotify.enabled = process.env.MOPIDY_SPOTIFY_ENABLED || "false";
  mopidy.spotify.username = process.env.MOPIDY_SPOTIFY_USERNAME || "none";
  mopidy.spotify.password = process.env.MOPIDY_SPOTIFY_PASSWORD || "none";

  fs.writeFileSync('/etc/mopidy/mopidy.conf', ini.stringify(mopidy));
  console.log(chalk.cyan('starting Mopidy...'));
  exec('systemctl start mopidy', (error, stdout, stderr) => {
    if (error) {
      console.log(chalk.red(`exec error: ${error}`));
      return;
    }
    console.log(chalk.green(`stdout: ${stdout}`));
    console.log(chalk.red(`stderr: ${stderr}`));
  });
  // TBD: control LED Matrix

  setInterval(function keepalive() {

  },60000);

})();