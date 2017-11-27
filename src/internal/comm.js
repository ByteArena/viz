// @flow

import { Frame } from "./bucket";

export default function comm(
    websocketurl: string,
    tps: number,
    onData: (type: string, data: any) => void,
) {
    let ws = null;

    function retry() {
        try {
            ws = new WebSocket(websocketurl);
        } catch (e) {
            window.setTimeout(retry, 1000);
            return;
        }

        ws.onerror = (/*evt*/) => {
            if (!ws) return;
            ws.close();
            window.setTimeout(retry, 1000);
            onData("status", false);
            console.error("Failed to connected to", websocketurl);
        };

        ws.onopen = (/*evt*/) => {
            if (!ws) return;
            onData("status", true);

            ws.onmessage = (evt: any) => {
                let msg: any;
                try {
                    msg = JSON.parse(evt.data);
                } catch (e) {
                    console.error(e, evt.data);
                    return;
                }

                switch (msg.type) {
                    case "framebatch": {

                        onData("framebatch", msg.data.map(Frame.fromVizmessage));
                        break;
                    }

                    case "init": {
                        onData("init", msg.data);
                        break;
                    }
                }
            };

            ws.onclose = (/*evt*/) => {
                onData("status", false);
                if (ws !== null) {
                    ws.close();
                    ws = null;
                }
                window.setTimeout(retry, 1000);
            };
        };
    }

    retry();
}
