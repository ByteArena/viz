import main from './main';

interface Window { ByteArena: any; }

(<any>window).ByteArena = (<any>window).ByteArena || {};
(<any>window).ByteArena.startViz = function (canvas: HTMLCanvasElement, wsurl: string, tps: number) {
    main(canvas, wsurl, tps);
}