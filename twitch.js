const twitch = window.Twitch.ext;
var options = null;

        twitch.onAuthorized(() => {
            console.log("onAuthorized called!");
            // Load existing config
            if (twitch.configuration.broadcaster) {
                console.log("onAuthorized called w/ broadcaster!");
                
            }
        });

        function saveConfig() {
            console.log("saveConfig called!");
            const message = JSON.stringify({message: document.getElementById('message').value});
            console.log("saving " + message);
            twitch.configuration.set('broadcaster', '1.0', message);

            window.Twitch.ext.send('broadcast', 'application/json', message);
        }

        // onContext callback called when context of an extension is fired 
twitch.onContext((context) => {
  console.log("onContext:",context);
});

// when the config changes, update the panel! 
twitch.configuration.onChanged(function(){
  console.log("in onChanged");
  console.log("broadcaster:",twitch.configuration.broadcaster);
  
  if(twitch.configuration.broadcaster){
    console.log("config exists");
    try{
      var config = JSON.parse(twitch.configuration.broadcaster.content)
      //console.log(typeof config)
      if(typeof config === "object"){
        options = config
        
        console.log(options)
      }else{
        console.log('invalid config')
      }
    }catch(e){
      console.log('invalid config')
    }
  }
});
