import main from './main';

interface Window { ByteArena: any; }

let pcapp;

(<any>window).BAHookAppCreated = function(app) {
    pcapp = app;
};

(<any>window).BAHookAppConfigured = function(app) {

};

(<any>window).BAHookSceneLoaded = function(scene) {

    // scene.exposure=1.1;
    // const agent = scene.root.getChildren()[5];
    // agent.setLocalScale(0.1, 0.1, 0.1);
    // let angle = 0;
    // const radius = 2;
    // const initialp = agent.getPosition().data;
    // const raf = function() {
    //     agent.setPosition(initialp[0] + radius * Math.cos(angle), initialp[1], initialp[2] + radius * Math.sin(angle));
    //     window.requestAnimationFrame(raf);
    //     angle += 0.01;
    // };

    // raf();

    const settings = (<any>window).BAVizSettings;
    main(pcapp, settings.wsurl, settings.tps, settings.cdnbaseurl);
};