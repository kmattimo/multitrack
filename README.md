multitrack
==========

A multitrack rehearsal tool for A Capella, etc. Tweak the parts to get a perfect practice track. 

An excuse to learn Symfony2 and the Web Audio API. 


Thanks to https://github.com/squallooo/MT5 for lots of relevant webaudio code to learn from! 

Also uses https://github.com/ScottMichaud/AudioSampleLoader

The song object uses knockoutJS observables to bind to the UI. 

Gulp/Sass/browsersync workflow. Front-end with trimmed down Materialize framework SCSS. Please let me know if you like the text-editor themed dark color scheme or not :)


Demo at http://multitrack.kylemattimore.com - Currently on heroku free instance, so be patient on the initial load :)



Installation
=============
- Configure database schema
- set BUILDPACK_URL= https://github.com/heroku/heroku-buildpack-php, if heroku/dokku thinks it is a nodejs app
- set SYMFONY_ENV=prod
- dokku/heroku postgres:create multitrack-postgres
- dokku/heroku postgres:link multitrack-postgres multitrack

Do these before pushing, so the parameters.yml is populated correctly. 

Post deploy: 
- dokku/heroku run php app/console doctrine:schema:create
