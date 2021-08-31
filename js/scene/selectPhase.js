class SelectPhase extends Phaser.Scene
{
    constructor ()
    {
        super('selectPhase');
    }

    init(data) {
        this.sceneName = data.sceneName;
    }

    preload ()
    {
        this.load.html('start', 'html/start.html');
        this.load.json("before_" + this.sceneName, "scenario/before_" + this.sceneName + ".json"); 
    }

    create ()
    {
        let self = this;
        let scenario = this.cache.json.get("before_" + this.sceneName);
        if(tutorial < 3) {
            if(scenario) {
                let dm = this.plugins.install('myPluginRef1', DialogMessagePlugin, true);
                dm.show(this, scenario, () => {
                    self.scene.start('explore',{sceneName:"tutorial" + (++tutorial)});
                });
            } else {
                let text = this.add.text(400,300,"Tutorial " + ++tutorial);
                this.scene.start('explore',{sceneName:"tutorial"+tutorial});
            }
        } else {
            this.scene.start('setup');
        }
    }
}