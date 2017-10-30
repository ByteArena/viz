// https://medium.com/@necsoft/three-js-101-hello-world-part-1-443207b1ebe1

import comm from './comm';

export default async function main(app: any, wsurl: string, tps: number, cdnbaseurl: string) : Promise<any> {
    comm(wsurl, tps, function(map) {
        console.log("SETMAP", map);
    }, function(msg) {
        console.log("VIZMSG", msg);
    });
}
