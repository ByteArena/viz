import Deque from 'denque';
import expandAndInterpolateBatch from './expandinterpolate';
import './protocol/vizmessage';
import './protocol/deque';
import { Bucket, Frame } from './bucket';

export default function comm (websocketurl: string, tps: number, setMap: (map: any) => void, onMessage: (message: Object) => void) {

    let ws = null;
    const bucket = new Bucket();

    function retry() {

        try {
            ws = new WebSocket(websocketurl);
        } catch(e) {
            //window.setTimeout(retry, 1000);
        }

        ws.onerror = evt => {
            ws.close();
            window.setTimeout(retry, 1000);
            console.error("Failed to connected to", websocketurl);
        }

        ws.onopen = evt => {
            console.log("Connected to", websocketurl);

            ws.onmessage = evt => {

                let msg;
                try {
                    msg = JSON.parse(evt.data);
                } catch(e) {
                    console.log("ERROR", e, evt.data);
                }

                switch(msg.type) {
                    case "init": {
                        setMap(msg.data.map);
                        break;
                    }
                    case "framebatch": {
                        bucket.addFrames(msg.data.map(Frame.fromVizmessage));
                        break;
                    }
                }
            }

            ws.onclose = function(evt) {
                console.log("WS CLOSE");
                if(ws !== null) {
                    ws.close();
                    ws = null;
                }
                window.setTimeout(retry, 1000);
            }
        }
    }

    retry();

    window.setInterval(function() {
        const next3 = bucket.next3();
        if(next3 !== undefined) {
            bucket.consumeOne();
            expandAndInterpolateBatch(next3, tps, 60, onMessage);   // TODO(jerome): remove 60 (fps) and rely on rAF rate
        }
    }, 1000/tps);
};
