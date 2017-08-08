import { Bucket, Frame } from './bucket';
import expandAndInterpolateBatch from './expandinterpolate';

let chunkBuffer = "";
let interval;
let bufferBatches = [];
let frameBuffer = [];
let stopDownloading = false;

let totalLines = 0;

export function newReplay(url, {setMap, setVizMessage, tps}) {
  const bucket = new Bucket();

  window
    .fetch('http://bytearena.com/maps/deathmatch/desert/death-valley/map.json')
    .then(x => x.json())
    .then(map => {
      setMap(map);
    });

  streamHttp.get(url, function(res) {

    res.on("data", function(chunk) {
      var string = new TextDecoder("utf-8").decode(chunk);

      chunkBuffer += string

      const data = chunkBuffer.split("\n");

      if (data.length === 1) {
        return;
      }

      chunkBuffer = data.pop()

      onBatches(data)
    });

    res.on("end", function() {
      console.log("end");
      stopDownloading = true;

      console.warn("buffering completed:", totalLines, "lines");
    });
  });

  interval = window.setInterval(function() {

      // console.log(frameBuffer.length, "frame(s) buffered");

      if (frameBuffer.length === 0) {
        if (stopDownloading === true) {
          clearInterval(interval)
        }

        return;
      }

      const frame = frameBuffer.shift();
      setVizMessage(frame);
      return;

      bucket.addFrames([
        Frame.fromVizmessage(frame)
      ]);

      // console.log("setVizMessage", frames.map(Frame.fromVizmessage))

      const next3 = bucket.next3();
      if(next3 !== undefined) {
          bucket.consumeOne();
          expandAndInterpolateBatch(next3, tps, 60, setVizMessage);   // TODO: remove 60 (fps) and rely on rAF rate
      }
    }, 1000/tps);
}


function onBatches(batches) {
  bufferBatches = [...bufferBatches, ...batches.map(JSON.parse)];
  frameBuffer = [...frameBuffer, ...flatten(bufferBatches)];

  totalLines += batches.length
}

function flatten(arr) {
  return arr.reduce(
    function(flat, toFlatten) {
      return flat.concat(
        Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten
      );
    },
    []
  );
}
